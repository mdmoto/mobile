const promotion = [
  {
    title: "promotion.pointsActivities",
    value: "POINTS_GOODS",
  },
  {
    title: "promotion.bargainActivities",
    value: "KANJIA",
  },
  {
    title: "promotion.minus",
    value: "MINUS",
  },
  {
    title: "promotion.groupBuy",
    value: "GROUPBUY",
  },
  {
    title: "promotion.pointsExchange",
    value: "EXCHANGE",
  },
  {
    title: "promotion.halfPrice",
    value: "HALF_PRICE",
  },
  {
    title: "promotion.fullDiscount",
    value: "FULL_DISCOUNT",
  },
  {
    title: "promotion.seckill",
    value: "SECKILL",
  },
  {
    title: "promotion.joinGroup",
    value: "PINTUAN",
  },
  {
    title: "order.coupon",
    value: "COUPON",
  },
];
export default promotion
/**格式化 */
export function formatType(val){
    if(val != undefined){
        promotion.forEach(item=>{
            if(val == item.value){
                return item.title
            }
        })
    }
}