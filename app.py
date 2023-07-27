# -*- coding: utf-8 -*-

from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql
import threading

app = Flask(__name__)
CORS(app)

# 数据库连接配置
connection = pymysql.connect(
    host='rm-cn-9lb3b12xv000wdfo.rwlb.rds.aliyuncs.com',
    user='ecnu',
    password='Ecnu123456',
    database='ecnu'
)

lock = threading.Lock()   # 创建全局互斥锁

@app.route('/query', methods=['GET'])
def query():
    try:
        # 创建游标对象
        cursor = connection.cursor()
        # 获取查询参数
        sql = request.args.get('sql')
        # 互斥锁
        lock.acquire()
        # 执行查询
        cursor.execute(sql)
        # 解锁
        lock.release()
        # 获取查询结果
        results = cursor.fetchall()
        # 关闭游标
        cursor.close()
        # 返回查询结果
        return jsonify(results)

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(host="127.0.0.1",port="5000",debug=True)
