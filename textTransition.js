  const win         = $(window),
        doc         = $(document)

  let demoSection
    , galleries
    , nav         = $('.nav')
    , navButtons  = nav.find('li')
    , caret       = $('.caret')
    , initialState = true
    , scrollSpeed = 900 // 900ms speed scrolling when user clicks on a nav
    , croppingTopMaximum = 0.05 // 5% of the top could be cropped
    , captions = []
    , animate = false
  
  const initialStyles = () => {
    if(!demoSection.length) return
    galleries   = demoSection.find('.pictures')

    if(initialState) {
      galleries.find('.caption').each((i, caption) => { captions.push($(caption).outerHeight()) })
      galleries.css('background-position', `center top`)
      demoSection.each((i, section) => {$(section).css('z-index', galleries.length - i )})
      nav.css('transform', `translateY(-50%)`);
    }
  
    captions = new Array()

    let heightRatio = 0.5625 // 16:9
    let imgHeight = win.width() * heightRatio
    let ratio = win.width()/win.height()
      if(ratio > 1.77778) {
        if(ratio > 2.22222) ratio = 2.22222
        let croppingHeightPercentage = (100 - ((2.22222 - ratio) * 100) / 0.4445) / 100
        galleries.css('background-position', `center -${imgHeight * (croppingTopMaximum * croppingHeightPercentage)}px`)
        imgHeight = win.width() / ratio
      } else {
        galleries.css('background-position', `center 0`)
      }

    galleries.each((i, gallery) =>  {
      let caption = $(gallery).find('figcaption')

      $(gallery).css({
        'background-image': `url(${$(gallery).data('img')})`,
        'min-height': 'initial',
        'height': imgHeight
      })

      caption.css('height', 'initial')
      captions.push(caption.outerHeight())
 
      $(gallery).css({
        'height': (win.innerHeight() < win.width() * 0.5625 ? imgHeight : win.innerHeight())
      }) 

      caption.css('position', `fixed`)
      caption.css('transform', `translateY(50%)`)

      if(initialState) {
        caption.addClass('loaded')
      }
    })
    
    scrollDetect()
  }
  
  const scrollDetect = () => {

    const st = $(window).scrollTop()
      , windowHeight = window.innerHeight 
      , offSets = []
      , detects = []

    galleries.each((i, gallery) => { 
      const caption = $(gallery).find('figcaption')
        , detectOffset = caption.outerHeight(true) - caption.outerHeight(true)
        offSets.push($(gallery).offset().top) 
        detects.push(i === galleries.length - 1 ? 
          (offSets[i] + $(gallery).outerHeight()/2) :
          (offSets[i] + $(gallery).outerHeight() - captions[i]/2 + detectOffset)
        )
        
  
        if(detects[i] && i !== galleries.length - 1) {
          if(st + windowHeight/2 > detects[i]) {
            const decreasedHeight = captions[i] + detects[i] - (st + windowHeight/2)
            caption.css({
              'height': (decreasedHeight < 0 ? 0 : decreasedHeight) + 'px',
              'transition':'none',
              'transform': `translateY(${-(captions[i]/2)}px)`
            })
          } else {
            caption.css({
              'height': captions[i],
              'transition':'transform .3s',
              'transform': `translateY(-50%)`
            })
          }
        } else if(i === galleries.length - 1) {
          if(st + windowHeight/2 > detects[i]) {
            caption.addClass('static').css('cssText', `top: calc(50%)!important; transform: translateY(${-(captions[i]/2)}px)`)
            nav.css({'position': 'absolute', 'top': offSets[i] + $(gallery).outerHeight()/2})
          } else {
            caption.removeClass('static').css('cssText', `top: calc(50%)!important; position: fixed; transform: translateY(${-(captions[i]/2)}px)`)
            nav.css({
              'position': 'fixed', 
              'top': `50%`,
            })
          }
        }
        ((caption.outerHeight(false) >= (windowHeight - 300)) && !initialState) ? caption.hide() : caption.show() 

    })
    
    /* Chapter active detection */
    navButtons.each((i, elm) => {
      if (st > offSets[i] + $(galleries[i]).outerHeight()/2) {
        $(elm).removeClass('active')
      } else {
        if (st <= offSets[i] - $(galleries[i]).outerHeight()/2) {
          $(elm).removeClass('active') 
        } else {
          $(galleries[i]).attr('nav-color') === 'dark' ? nav.addClass('dark') : nav.removeClass('dark')
          $(elm).addClass('active')
        }
      }
    })

    $(galleries[galleries.length]).css({
      'cssText': `top: 50%!important`,
      'transform': `translateY(-${captions[galleries.length]/2}px)`
    })
  }

  win.scroll( _ =>  { if($('.textTransitionDemo').length && !initialState) scrollDetect() });
  win.resize( _ =>  { if($('.textTransitionDemo').length) { initialStyles() } });
  win.load(_ =>     { if($('.textTransitionDemo').length) { init() } });

  const init = () => {
    demoSection = $('.textTransitionDemo')
    initialStyles()
    initialState = false
    /* sticky nav click events */
    navButtons.click((e) => {
      if(animate) return
      animate = true
      const target = $(e.currentTarget).data('for')
        , moveTo = $(`#${target}`).offset().top
      $("html, body").animate({
        scrollTop: moveTo
      }, scrollSpeed, () => {
        animate = false
      });
    });
  }
