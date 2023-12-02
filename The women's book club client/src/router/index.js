import VueRouter from 'vue-router'

import ContainerPage from '@/pages/ContainerPage'
import LoginPage from '@/pages/LoginPage'
import IndexPage from '@/pages/IndexPage'
import NoteManage from '@/pages/NoteManage'
import PlanManage from '@/pages/PlanManage'
import StudyProgress from '@/pages/StudyProgress'
import ManagePage from '@/pages/ManagePage'
import UserPage from '@/pages/UserPage'
import UserInfo from '@/pages/UserInfo'
import NoteTypes from '@/pages/NoteTypes'
import page404 from '@/pages/page404'
import MarkdownView from '@/pages/MarkdownView'

const router =  new VueRouter({
    routes: [
        {
            name: '',
            path: '/',
            component: ContainerPage,
            children: [
                {
                    path: 'manage',
                    component: ManagePage,
                    children: [
                        {
                            path: 'index',
                            component: IndexPage
                        },
                        {
                            path: 'note',
                            component: NoteManage
                        },
                        {
                            path: 'plan',
                            component: PlanManage
                        },
                        {
                            path: 'study',
                            component: StudyProgress
                        },
                        {
                            path: 'view',
                            name: 'View',
                            component: MarkdownView
                        },
                    ]
                },
                {
                    path: 'account',
                    component: UserPage,
                    children: [
                        {
                            path: 'info',
                            component: UserInfo
                        },
                        {
                            path: 'types',
                            component: NoteTypes
                        }
                    ]
                }
            ]
        },
        {
            path: '/login',
            component: LoginPage
        },
        {
            path: '*',
            component: page404
        }
    ]
})

router.beforeEach((to, from, next) => {
    // console.log(to);
    if (to.path.startsWith('/manage') || to.path.startsWith('/account') || to.path === '/view') {
        if (JSON.parse(sessionStorage.getItem('userInfo'))) {
            next()
        } else {
            next('/login')
        }
    } else if (to.path === '/') {
        if (JSON.parse(sessionStorage.getItem('userInfo'))) {
            next('/manage/index')
        } else {
            next('/login')
        }
    } else if (to.path === '/login') {
        if (JSON.parse(sessionStorage.getItem('userInfo'))) {
            next('/manage/index')
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router