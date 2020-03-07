<template>
  <div id="hy-swiper">
    <div class="swiper" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <slot></slot>
    </div>
    <slot name="indicator">
    </slot>
    <div class="indicator">
      <slot name="indicator" v-if="showIdicator && slideCount>1">
      <div v-for="{item, index} in slideCount" class="indi-item" :class="{active: index === currentIndex-1}" :key="index">
      </div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Swiper',
  props: {
    interval: {
      type: Number,
      default: 3000
    },
    animDuration: {
      type: Number,
      default: 300
    },
    moveRatio: {
      type: Number,
      default: 0.25
    },
    showIdicator: {
      type: Boolean,
      default: true
    }
  },
  data: function () {
    return {
      slideCount: 0,
      totalWidth: 0,
      swiperStyle: {},
      currentIndex: 1,
      scrolling: false
    }
  },
  mounted: function () {
    setTimeout(() => {
      this.handleDom()
      this.startTimer()
    }, 300)
  },
  methods: {
    startTimer: function () {
      this.playTimer = window.setInterval(() => {
        this.currentIndex++
        this.scrollContent(-this.currentIndex * this.totalWidth)
      }, this.interval)
    },
    stopTimer: function () {
      window.clearInterval(this.playTimer)
    },
    scrollContent: function (currentPosition) {
      // 0.set rolling
      this.scrolling = true
      // 1.start scrolling
      this.swiperStyle.transition = 'transform' + this.animDuration + 'ms'
      this.setTransform(currentPosition)
      // 2.juge position of scrolling
      this.checkPosition()
      // completed
      this.scrolling = false
    },
    // 1.check the correct position
    checkPosition: function () {
      window.setTimeout(() => {
        this.swiperStyle.transition = '0ms'
        if (this.currentIndex >= this.slideCount + 1) {
          this.currentIndex = 1
          this.setTransform(-this.currentIndex * this.totalWidth)
        } else if (this.currentIndex <= 0) {
          this.currentIndex = this.slideCount
          this.setTransform(-this.currentIndex * this.totalWidth)
        }
        // 2.callback after move
        this.$emit('transitionEnd', this.currentIndex - 1)
      }, this.animDuration)
    },
    // set position of moving
    setTransform: function (position) {
      this.swiperStyle.transform = `translate3d(${position}px, 0, 0)`
      this.swiperStyle['-webkit-transform'] = `translate3d(${position}px, 0, 0)`
      this.swiperStyle['-ms-transform'] = `translate3d(${position}px, 0, 0)`
    },
    // option of DOM, add Slide before&after DOM
    handleDom: function () {
      let swiperEl = document.querySelector('.swiper')
      let slidesEls = swiperEl.getElementsByClassName('slide')
      // save number
      this.slideCount = slidesEls.length
      // if greater than 1, then add a slide before&after
      if (this.slideCount > 1) {
        let cloneFirst = slidesEls[0].cloneNode(true)
        let cloneLast = slidesEls[this.slideCount - 1].cloneNode(true)
        swiperEl.insertBefore(cloneLast, slidesEls[0])
        swiperEl.appendChild(cloneFirst)
        this.totalWidth = swiperEl.offsetWidth
        this.swiperStyle = swiperEl.style
      }
      // let the swiper element show the first element
      this.setTransform(-this.totalWidth)
    },
    touchStart: function (e) {
      // 1.if scrolling, can not dragging
      if (this.scrolling) return
      // stop interval
      this.stopTimer()
      // save position of starting scroll
      this.startX = e.touches[0].pageX
    },
    touchMove: function (e) {
      // 1.work out distance of user scrolling
      this.currentX = e.touches[0].pageX
      this.distance = this.currentX - this.startX
      const currentPosition = -this.currentIndex * this.totalWidth
      const moveDistance = this.distance + currentPosition
      // set current position
      this.setTransform(moveDistance)
    },
    touchEnd: function (e) {
    // 1.get distance of moving
      const currentMove = Math.abs(this.distance)
      // 2.judge the ultimate position
      if (this.distance === 0) {
        return
      } else if (this.distance > 0 && currentMove > this.totalWidth * this.moveRatio) {
        this.currentIndex--
      } else if (this.distance < 0 && currentMove > this.totalWidth * this.moveRatio) {
        this.currentIndex++
      }
      // 3.move to correct position
      this.scrollContent(-this.currentIndex * this.totalWidth)
      // 4.restart interval after complete
      this.startTimer()
    },
    // control prior, next
    previous: function () {
      this.changeItem(-1)
    },
    next: function () {
      this.changeItem(1)
    },
    changeItem: function (num) {
    // remove interval
      this.stopTimer()
      // modify index & position
      this.currentIndex += num
      this.scrollContent(-this.currentIndex * this.totalWidth)
      // add interval
      this.startTimer()
    }
  }

}
</script>

<style scoped>
  #hy-swiper {
    overflow: hidden;
    position: relative;
  }
  .swiper {
    display: flex;
  }
  .indicator {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
    bottom: 8px;
  }
  .indi-item {
    box-sizing: border-box;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: #FFF;
    line-height: 8px;
    text-align: center;
    font-size: 12px;
    margin: 0 5px;
  }
  .indi-item.active {
    background-color: rgba(212, 62, 46, 1.0);
  }
</style>
