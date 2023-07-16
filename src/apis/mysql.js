import httpInstance from "@/utils/http"

export function getSQLAPI(sql) {
  return httpInstance({
    url: '/query',
    params: {
      sql
    }
  })
}