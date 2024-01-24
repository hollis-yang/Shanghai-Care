# -*- coding: utf-8 -*-

from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql
import threading

app = Flask(__name__)
CORS(app)

# 数据库连接配置
connection = pymysql.connect(   
    host='rm-cn-x0r3j6fcx0024svo.rwlb.rds.aliyuncs.com',
    user='webs',
    password='WebGIS2023',  
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


@app.route('/insert', methods=['POST'])
def add_data():
    try:
        # 获取POST请求中的JSON数据
        data = request.get_json()
        sql = data.get('sql')

        if sql:
            # 创建游标对象
            cursor = connection.cursor()
            # 互斥锁
            lock.acquire()
            # 执行插入操作
            cursor.execute(sql)
            # 提交事务
            connection.commit()
            # 解锁
            lock.release()
            # 关闭游标
            cursor.close()
            # 返回成功响应
            return jsonify({'message': 'Data added successfully!'}), 200
        else:
            return jsonify({'error': 'No SQL code provided.'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)
