import { createRouter, createWebHistory } from 'vue-router'
import Dashboardview from '../view/homepage/main.vue'
import mainmember from '../view/display/member/mainmember.vue'
import newsinsert from '../view/display/news/newsinsert.vue'
import joblist from '../view/jobs/joblist.vue'
import announcement from '../view/announcement/announcement.vue'
import Board_director from '../view/board_director/board_director.vue'
import Lapnet from '../view/lapnet/lapnet.vue'

import memberbankview from '../view/display/member/memberbankview.vue'

import Newsview from '../view/display/news/newsview.vue'
import jobview from '../view/display/job/jobview.vue'
import announcementviewer from '../view/announcement/announcementviewer.vue'
import membersedit from '../view/display/member/MembersEdit.vue.vue'
import newsedit from '../view/display/news/newsedit.vue'
import announcementedit from '../view/announcement/announcementedit.vue'
import jobedit from '../view/display/job/jobedit.vue'
const routes = [
  {
    path: '/',
    name: 'Dashboardview',
    component: Dashboardview,
  },
    {
    path: '/dashboard',
    name: '',
    component: Dashboardview,
  },
  {
    path: '/memberinsert',
    name: 'memberinsert',
    component: mainmember,
  },
  {
    path: '/members',
    name: 'members',
    component: memberbankview,
  },
  {
    path: '/membersedit',
    name: 'membersedit',
    component: membersedit,
  },
  {
    path: '/news',
    name: 'news',
    component: Newsview,
  },
 
  {
    path: '/newinsert',
    name: 'newinsert',
    component: newsinsert,
  },
  {
    path: '/newsedit',
    name: 'newsedit',
    component: newsedit,
  },
   {
    path: '/joblist',
    name: 'joblist',
    component: joblist,
  },
   {
    path: '/jobview',
    name: 'jobview',
    component: jobview,
  },
   {
    path: '/jobedit',
    name: 'jobedit',
    component: jobedit,
  },
   {
    path: '/announcement',
    name: 'announcement',
    component: announcement,
  },
   {
    path: '/announcementviewer',
    name: 'announcementviewer',
    component: announcementviewer,
  },
   {
    path: '/announcementedit',
    name: 'announcementedit',
    component: announcementedit,
  },
   {
    path: '/board_director',
    name: 'board_director',
    component: Board_director,
  },
   {
    path: '/lapnet_employee',
    name: 'lapnet',
    component: Lapnet,
  },
 



  

 
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
