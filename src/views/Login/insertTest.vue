<script setup>
import { insertSQLAPI } from '@/apis/insertsql'

// insert
const sqlCode = "INSERT INTO admin_accounts (id, account, password) VALUES (1223, '22aa', '122aa');"

// 发送POST请求给后端
insertSQLAPI(sqlCode)
  .then(response => {
    // 处理后端返回的响应数据
    console.log(response)
  })
  .catch(error => {
    // 处理错误
    console.error("Error:", error)
  })
</script>