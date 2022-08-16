import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form,FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// import { Message } from 'element-ui'
import {Button,Form,FormItem,Input,Message,
    Container,Header,Aside,Main,Menu,Submenu,MenuItemGroup,
    MenuItem,breadcrumb,BreadcrumbItem,card,row,col,table,
    TableColumn,Switch,tooltip,pagination,dialog,MessageBox,
    Tag,tree,select,option} from 'element-ui'





Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(card)
Vue.use(col)
Vue.use(row)
Vue.use(table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(tooltip)
Vue.use(pagination)
Vue.use(dialog)
Vue.use(Tag)
Vue.use(tree)
Vue.use(select)
Vue.use(option)



Vue.prototype.$message=Message
Vue.prototype.$confirm=MessageBox.confirm



