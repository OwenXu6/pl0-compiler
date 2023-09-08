<template>
  <div class="sidebar">
    <el-menu 
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="sidebar.collapse"
            unique-opened
            router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.permiss">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-sub-menu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
                  v-permiss="item.permiss"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index" v-permiss="item.permiss">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useSidebarStore} from '../store/sidebar';
import {useRoute} from 'vue-router';

const items = [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: '系统首页',
    permiss: []
  },
  {
    icon: 'goods',
    index: '1',
    title: '藏品管理',
    permiss: ['CollectionManager',"SystemAdmin"],
    subs: [
      {
        index: '/collection_add',
        title: '新增藏品',
        permiss: ['SystemAdmin'],
        subs: undefined
      },
      {
        index: '/collection_search',
        title: '查询藏品',
        permiss: ['SystemAdmin'],
      },
      {
        index: '/collection_research4unknown',
        title: '未知文物研究鉴定',
        permiss: ['SystemAdmin'],
      },
    ],
  },
  {
    icon:'lock',
    index: '/Human_Management',
    title: '人事管理',
    permiss: ['SystemAdmin','User'],
  },
  {
    icon: 'more',
    index: '2',
    title: '展厅',
    permiss: ['SystemAdmin'],
    subs: [
      {
        index: '/table',
        title: '展厅信息',
        permiss: ['SystemAdmin'],
      },
      {
        index: '/collections',
        title: '展品详情',
        permiss: ["SystemAdmin"],
      },
      {
        index: '/activity',
        title: '活动',
        permiss: ["SystemAdmin"],
      },
    ],
  },
  {
    icon: 'Calendar',
    index: '/statistics',
    title: '统计信息',
    permiss: ["SystemAdmin"],
  },
  {
    icon: 'share',
    index: '/charts',
    title: '人流信息',
    permiss: ["SystemAdmin"],
  },
  {
    icon: 'edit',
    index: '/charts',
    title: '系统设置',
    permiss: ["SystemAdmin"],
  },
  {
    icon: "shop",
    index: "3",
    title: "运营与合作",
    permiss: ["SystemAdmin"],
    subs: [
      {
        index: '/feedbacks',
        title: '反馈信息管理',
        permiss: ["SystemAdmin"],
      },
      {
        index: '/products',
        title: '文创产品信息管理',
        permiss: ["SystemAdmin"],
      },
      {
        index: '/cooperations',
        title: '合作联名项目',
        permiss: ["SystemAdmin"],
      },
    ]
  },
  {
    icon: "rank",
    index: "/ccard",
    title: "个人中心",
    permiss: ["SystemAdmin"],
  },
  {
    icon: "DocumentCopy",
    index: "/demo",
    title: "demo",
    permiss: ["SystemAdmin"],
  }
];

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}

/* 设置一级菜单和二级菜单的背景颜色 */
.el-sub-menu .el-menu-item {
  background-color: #f1f3fe !important;
}
/* 设置选鼠标指针浮动在一级菜单的设置 */
.el-menu-item:hover{
  background-color: #f1f3fe !important;;
}
/* 设置当前被选中的一级菜单 */
.el-menu-item.is-active {  
  color: #fff !important;  
  background: #579EF8 !important;  
}  
</style>
