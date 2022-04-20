/* 获取品牌管理的数据模块 */
import request from '@/utils/request'

/**
 * 获取品牌列表的接口
 * @param page 当前页码
 * @param limit 每页条数
 */
export const reqTradeMark = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

/**
 * 新增或修改品牌
 * @param id 品牌ID
 * @param tmName 品牌名称
 * @param logoUrl 品牌Logo
 */
export const reqAddOrUpdateTradeMark = (tmForm) => {
  /* eslint-disable */
  if (tmForm.hasOwnProperty('id')) return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tmForm})
  else return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tmForm})
}

/**
 * 删除品牌
 * @param id 品牌ID
 */
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
