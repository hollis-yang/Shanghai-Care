<script setup>
import { useActStore } from '@/stores/activity'
let actStore = useActStore()
</script>

<template>
  <div class="nav">
    <!-- <div class="activity-nav-search">
      <div class="searchName">
        <span>活动名称</span>
        <input type="text" placeholder="请输入活动" v-model="actStore.search" name="" id="">
      </div>
      <el-button @click="actStore.getSearch" type="primary">查询</el-button>
    </div> -->

    <div class="activity-nav-search">
      <div class="top">
        <el-input v-model="actStore.search" placeholder="请输入活动" name="" id="">
          <template #prepend>
            <div>
              活动名称
            </div>
          </template>
        </el-input>
        <div class="btn">
          <el-button @click="actStore.getSearch" type="primary">查询</el-button>
        </div>
      </div>
    </div>

    <!-- <div class="activity-nav-screen">
      <span>筛选条件</span>
      <el-select v-model="actStore.value1" class="m-2" @change="actStore.filterBox">
        <el-option v-for="item in actStore.options1" :key="item.id" :label="item.value" :value="item.value" />
      </el-select>
      <el-select v-model="actStore.value2" @change="actStore.filterBox2" class="m-2">
        <el-option v-for="item in actStore.options2" :key="item.value" :label="item.value" :value="item" />
      </el-select>
      <el-button @click="actStore.getScreen" type="primary">筛选</el-button>
    </div> -->

    <div class="detail">
      <div class="detail-top">
        <span class="title">筛选条件</span>
        <el-select v-model="actStore.value1" class="conditionSelect" @change="actStore.filterBox">
          <el-option v-for="item in actStore.options1" :key="item.id" :label="item.value" :value="item.value" />
        </el-select>
        <el-select v-model="actStore.value2" @change="actStore.filterBox2" class="selectValue">
          <el-option v-for="item in actStore.options2" :key="item.value" :label="item.value" :value="item" />
        </el-select>
        <div class="footer">
          <el-button @click="actStore.getScreen" type="primary">筛选</el-button>
        </div>
      </div>
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
  margin: 2vw auto;
  justify-content: space-between;
  align-items: center;
  position: relative;

  // .activity-nav-screen {
  //   width: 50%;
  //   display: flex;
  //   justify-content: space-around;
  //   align-items: center;
  //   background-color: rgba(0, 0, 0, 0.3);
  //   padding: 1vw;
  // }

  // .m-2 {
  //   width: 30%;
  // }

  // button {
  //   padding: 1vh;
  //   background-color: #1827c4;
  //   color: #fff;
  //   border-radius: 0.5vh;
  //   border: 0;
  // }

  // .activity-nav-search {
  //   width: 35%;
  //   display: flex;
  //   justify-content: space-evenly;

  //   .searchName {
  //     display: flex;
  //     align-items: center;

  //     input {
  //       width: 10vw;
  //       padding: 1vh 1vw;
  //     }

  //     span {
  //       background-color: #1827c4;
  //       padding: 1vh 1vw;
  //     }

  //   }
  // }
}


.detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .detail-top {
    position: absolute;
    top: -2vh;
    right: -2vw;
    padding: 2vh 2vw;
    width: 39vw;
    color: #fff;
    background-color: #0000006b;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin: 0 2vw;
    flex-wrap: wrap;

    .title {
      font-weight: 600;
      padding-right: 1.5vw;
      font-size: 2.2vh;
    }

    .conditionSelect {
      width: 10vw;
      margin-right: 2vw;
    }

    .selectValue {
      width: 15vw;
    }

    .footer {
      position: absolute;
      right: 2.5vw;

      /deep/ .el-button {
        background-color: #1827c4 !important;
        border: none;
        width: 4vw !important;
        font-size: 2vh
      }
    }
  }
}

.top {
  position: absolute;
  top: 0vh;
  width: 30vw;
  height: 4vh;
  display: flex;

  /deep/ .el-input-group__prepend {
    background-color: #1827c4 !important;
    color: #fff !important;
    box-shadow: none !important;
    font-size: 1.8vh;
  }

  /deep/ .el-input__inner {
    font-size: 1.8vh;
  }
}

.btn {
  margin-left: 2vw;
  display: flex;

  /deep/ .el-button {
    background-color: #1827c4 !important;
    border: none;
    height: 100%;
    font-size: 1.8vh;
  }
}
</style>