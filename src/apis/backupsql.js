import httpInstance from "@/utils/http"

export function backupSQLAPI(sql) {
  return httpInstance({
    url: '/backup',
    params: {
      sql
    }
  })
}