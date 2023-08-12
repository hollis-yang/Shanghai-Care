<script setup>
import { useActStore } from '../../../stores/activity'
let actStore = useActStore()
</script>

<template>
    <div class="nav">
        <div class="activity-nav-search">
            <div class="searchName">
                <span>活动名称</span>
                <input type="text" placeholder="请输入活动" v-model="actStore.search" name="" id="">
            </div>
            <el-button @click="actStore.getSearch" type="primary">查询</el-button>
        </div>

        <div class="activity-nav-screen">
            <span>筛选条件</span>
            <el-select v-model="actStore.value1" class="m-2" @change="actStore.filterBox">
                <el-option v-for="item in actStore.options1" :key="item.id" :label="item.value" :value="item.value" />
            </el-select>
            <el-select v-model="actStore.value2" @change="actStore.filterBox2" class="m-2">
                <el-option v-for="item in actStore.options2" :key="item.value" :label="item.value" :value="item" />
            </el-select>
            <el-button @click="actStore.getScreen" type="primary">筛选</el-button>
        </div>
    </div>
</template>

<style lang="less" scoped>
input {
    outline: none;
}

.nav {
    width: 90%;
    display: flex;
    margin: 30px auto;
    justify-content: space-between;
    align-items: center;

    .activity-nav-screen {
        width: 50%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.3);
        padding: 10px;
    }
.m-2 {
    width: 30%;
}
    button {
        padding: 10px;
        background-color: #1827c4;
        color: #fff;
        border-radius: 5px;
        border: 0;
    }

    .activity-nav-search {
        width: 35%;
        display: flex;
        justify-content: space-evenly;

        .searchName {
            display: flex;
            align-items: center;

            input {
                width: 200px;
                padding: 5px 10px;
            }

            span {
                background-color: #1827c4;
                padding: 5px 10px;
            }

        }
    }
}
</style>