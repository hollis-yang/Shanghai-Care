import { defineStore } from 'pinia';
import { getSQLAPI } from '../apis/mysql'

export const useActStore = defineStore('activity', {
    state: () => {
        return {
            allNum: 0,
            tableData: [],
            pageSize: 10,
            currentPage: 1,
            search: '',
            options1: [
                {
                    id: 1,
                    value: '日期'
                },
                {
                    id: 2,
                    value: '时间'
                },
                {
                    id: 3,
                    value: '所属社区'
                },
            ],
            options2: [],
            dateop: [],
            timeop: [
                {
                    id: 1,
                    value: '7:00-12:00',
                    min: 7,
                    max: 12
                },
                {
                    id: 2,
                    value: '12:00-18:00',
                    min: 12,
                    max: 18
                },
                {
                    id: 3,
                    value: '18:00-20:00',
                    min: 18,
                    max: 20
                },
            ],
            communityop: [],
            value1: '全部',
            value2: '全部',
            screen: {},
            tablelist: [],
            alertflag: false,
            alert: {
                id: '',
                time: '',
                community: '',
                name: '',
                address: ''
            },
            addflag: false,
            editflag: false,
            endflag: false,
            addEdit: false
        };
    },
    actions: {
        // 保存
        async add(id) {
            console.log(id, this.alert);
            let time = `${new Date(this.alert.time).getFullYear()}-${`${(new Date(this.alert.time).getMonth() + 1)}`.length <= 1 ?
                `0${(new Date(this.alert.time).getMonth() + 1)}` : `${(new Date(this.alert.time).getMonth() + 1)}`}-${`${new
                    Date(this.alert.time).getDate()}`.length <= 1 ? `0${new Date(this.alert.time).getDate()}` :
                    `${new Date(this.alert.time).getDate()}`} ${`${(new Date(this.alert.time).getHours() + 8)}`.length <= 1 ? `0${(new Date(this.alert.time).getHours() + 8)}`
                        : `${(new Date(this.alert.time).getHours() - 8)}`}:${`${new Date(this.alert.time).getMinutes()}`.length <= 1
                            ? `0${new Date(this.alert.time).getMinutes()}` : `${new Date(this.alert.time).getMinutes()}`}:${`${new Date(this.alert.time).getSeconds()}`.length <= 1
                                ? `0${new Date(this.alert.time).getSeconds()}` : `${new Date(this.alert.time).getSeconds()}`}`
            let sql = ``
            if (id) {
                sql = `update community_activities set time='${time}',
                community='${this.alert.community}', name='${this.alert.name}',
                address='${this.alert.address}' where id='${id}'`
            } else {
                sql = `INSERT INTO community_activities (time,community,name,address)
                VALUE ('${time}', '${this.alert.community}','${this.alert.name}','${this.alert.address}')`
            }
            await getSQLAPI(sql)
            this.getdata()
            this.alertflag = false
            this.addEdit = false
            this.endflag = false
            this.editflag = false
            this.addflag = false
        },
        // 编辑按钮
        editBut() {
            this.addEdit = false
            this.endflag = false
            this.editflag = false
            this.addflag = true
        },
        // 弹框开
        flag(index, row) {
            console.log(index, row);
            this.alertflag = true
            if (!row) {
                this.alert = {
                    id: '',
                    time: '',
                    community: '',
                    name: '',
                    address: ''
                }
                this.addflag = true
                this.editflag = false
            } else if ((typeof index) === 'number') {
                this.echo(row)
                this.addflag = false
                this.editflag = true
                this.endflag = true
                this.addEdit = true
            }
        },
        // 弹框关
        async endalert() {
            // await getSQLAPI(`DELETE FROM community_activities WHERE id=${this.alert.id}`)
            this.alertflag = false
            this.alert = {
                id: '',
                time: '',
                community: '',
                name: '',
                address: ''
            }
        },
        // 回显数据
        echo(row) {
            this.alert.id = row[0]
            this.alert.time = new Date(row[3])
            this.alert.name = row[2]
            this.alert.community = row[1]
            this.alert.address = row[4]
        },
        // 渲染
        async getdata() {
            let data = await getSQLAPI(`SELECT * from community_activities`)
            this.filterList()
            this.tablelist = JSON.parse(JSON.stringify(data))
            this.tableData = data.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
            this.allNum = data.length
        },
        // 分页
        handleCurrentChange(val) {
            this.currentPage = val

            this.tableData = this.tablelist.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
        },
        // 搜索
        async getSearch() {
            if (this.search) {
                let data = await getSQLAPI(`select * from community_activities where name like '%${this.search}%' limit 0,8`)
                this.tablelist = JSON.parse(JSON.stringify(data))
                this.allNum = data.length
                this.tableData = this.tablelist.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
            } else {
                this.getdata()
            }
            this.value1 = '全部'
            this.value2 = '全部'
        },
        // 获取第二个筛选框内容
        async filterList() {
            let time = await getSQLAPI(`SELECT time from community_activities`)
            let community = await getSQLAPI(`SELECT community from community_activities`)
            community.map(item => {
                this.communityop.push({ id: this.communityop.length + 1, value: item[0] })
            })
            time.forEach(item => {
                this.dateop.push({ time: item[0], id: this.dateop.length + 1, value: new Date(item[0]).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }) })
            })
        },
        // 第一个筛选框
        filterBox(val) {
            if (val === '时间') {
                this.options2 = this.timeop
            } else if (val === '日期') {
                this.options2 = this.forop('dateop')
            } else if (val === '所属社区') {
                this.options2 = this.forop('communityop')
            }
            this.value2 = '全部'
        },
        //  第二个筛选框
        filterBox2(val) {
            console.log(val);
            this.screen = val
        },
        // 筛选
        async getScreen() {
            if (this.screen.id) {
                let sql = ``
                if (this.value1 === '日期') {
                    let time = new Date(this.screen.time).toLocaleDateString('af').slice(6, 7)
                    sql = `SELECT * FROM community_activities WHERE MONTH(time) = '${time}' `
                } else if (this.value1 === '所属社区') {
                    sql = `SELECT * FROM community_activities WHERE community='${this.screen.value}'`
                } else if (this.value1 === '时间') {
                    sql = `SELECT * FROM community_activities WHERE HOUR(time) BETWEEN ${this.screen.min} AND ${this.screen.max}`
                }
                let data = await getSQLAPI(sql)
                console.log(data);
                this.tablelist = JSON.parse(JSON.stringify(data))
                this.allNum = data.length
                this.tableData = this.tablelist.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
            } else {
                this.getdata()
            }
        },
        forop(name) {
            const uniqueValues = [];
            const filteredArray = this[name].filter(obj => {
                if (uniqueValues.includes(obj.value)) {
                    return false; // 如果value已经在uniqueValues中出现过，则返回false，表示不保留该对象
                } else {
                    uniqueValues.push(obj.value); // 将value添加到uniqueValues中
                    return true; // 返回true，表示保留该对象
                }
            });
            return filteredArray
        }
    },
});


{/* <span style="margin-left: 10px">{{
                            ` ${new Date(scope.row[3]).getFullYear()}-${`${(new Date(scope.row[3]).getMonth() + 1)}`.length <= 1 ?
        `0${(new Date(scope.row[3]).getMonth() + 1)}` : `${(new Date(scope.row[3]).getMonth() + 1)}`}-${`${new
            Date(scope.row[3]).getDate()}`.length <= 1 ? `0${new Date(scope.row[3]).getDate()}` :
            `${new Date(scope.row[3]).getDate()}`}
                                ${`${(new Date(scope.row[3]).getHours() - 8)}`.length <= 1 ? `0${(new Date(scope.row[3]).getHours() - 8)}`
        : `${(new Date(scope.row[3]).getHours() - 8)}`}:${`${new Date(scope.row[3]).getMinutes()}`.length <= 1
            ? `0${new Date(scope.row[3]).getMinutes()}` : `${new Date(scope.row[3]).getMinutes()}`}:${`${new Date(scope.row[3]).getSeconds()}`.length <= 1
                ? `0${new Date(scope.row[3]).getSeconds()}` : `${new Date(scope.row[3]).getSeconds()}`}`
}}</span> */}