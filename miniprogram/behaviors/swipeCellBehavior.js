export const swipeCellBehavior = Behavior({
  data: {
    openedSwipCellId: null
  },

  methods: {
    // 1.打开滑块时，将实例存储到队列中
    onSwipeCellOpen(e) {
      console.log(e)

      this.setData({
        openedSwipCellId: e.target.id
      })
      console.log(this.data.openedSwipCellId)
    },
    //2.点击页面时，关掉开启的滑块
    onSwipeCellClose() {
      if(!this.data.openedSwipCellId) return
      this.selectComponent(`#${this.data.openedSwipCellId}`).close()
      // 将存储打开的滑块清空
      this.setData({
        openedSwipCellId: null
      })
    },
  }
})