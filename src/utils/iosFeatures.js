// iOS-Specific Features and Optimizations

// Detect if running on iOS
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Detect if running as PWA
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
};

// Haptic Feedback (works on supported devices)
export const hapticFeedback = {
  light: () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
    // For iOS devices with Taptic Engine
    if (window.webkit?.messageHandlers?.haptic) {
      window.webkit.messageHandlers.haptic.postMessage('light');
    }
  },
  
  medium: () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
    if (window.webkit?.messageHandlers?.haptic) {
      window.webkit.messageHandlers.haptic.postMessage('medium');
    }
  },
  
  heavy: () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(30);
    }
    if (window.webkit?.messageHandlers?.haptic) {
      window.webkit.messageHandlers.haptic.postMessage('heavy');
    }
  },
  
  success: () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate([10, 10, 10]);
    }
    if (window.webkit?.messageHandlers?.haptic) {
      window.webkit.messageHandlers.haptic.postMessage('success');
    }
  },
  
  warning: () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate([30, 10, 30]);
    }
    if (window.webkit?.messageHandlers?.haptic) {
      window.webkit.messageHandlers.haptic.postMessage('warning');
    }
  },
  
  error: () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate([50, 10, 50, 10, 50]);
    }
    if (window.webkit?.messageHandlers?.haptic) {
      window.webkit.messageHandlers.haptic.postMessage('error');
    }
  }
};

// iOS Swipe Gesture Handler
export const createSwipeHandler = (element, callbacks = {}) => {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  };
  
  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  };
  
  const handleSwipe = () => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const minSwipeDistance = 50;
    
    // Horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > minSwipeDistance && callbacks.onSwipeRight) {
        hapticFeedback.light();
        callbacks.onSwipeRight();
      } else if (deltaX < -minSwipeDistance && callbacks.onSwipeLeft) {
        hapticFeedback.light();
        callbacks.onSwipeLeft();
      }
    }
    // Vertical swipes
    else {
      if (deltaY > minSwipeDistance && callbacks.onSwipeDown) {
        hapticFeedback.light();
        callbacks.onSwipeDown();
      } else if (deltaY < -minSwipeDistance && callbacks.onSwipeUp) {
        hapticFeedback.light();
        callbacks.onSwipeUp();
      }
    }
  };
  
  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  // Return cleanup function
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
};

// iOS Pull-to-Refresh Implementation
export const createPullToRefresh = (element, onRefresh) => {
  let startY = 0;
  let pullDistance = 0;
  const threshold = 100;
  let isPulling = false;
  
  const handleTouchStart = (e) => {
    if (element.scrollTop === 0) {
      startY = e.touches[0].pageY;
      isPulling = true;
    }
  };
  
  const handleTouchMove = (e) => {
    if (!isPulling) return;
    
    pullDistance = e.touches[0].pageY - startY;
    
    if (pullDistance > 0 && pullDistance < threshold * 1.5) {
      e.preventDefault();
      element.style.transform = `translateY(${pullDistance * 0.5}px)`;
      
      if (pullDistance > threshold) {
        hapticFeedback.medium();
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (!isPulling) return;
    
    if (pullDistance > threshold) {
      hapticFeedback.success();
      element.style.transform = 'translateY(50px)';
      onRefresh().finally(() => {
        element.style.transform = '';
      });
    } else {
      element.style.transform = '';
    }
    
    isPulling = false;
    pullDistance = 0;
  };
  
  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchmove', handleTouchMove, { passive: false });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
  };
};

// iOS Keyboard Management
export const iosKeyboard = {
  // Scroll input into view when keyboard appears
  scrollToInput: (input) => {
    if (isIOS()) {
      setTimeout(() => {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  },
  
  // Dismiss keyboard
  dismiss: () => {
    if (document.activeElement) {
      document.activeElement.blur();
    }
  },
  
  // Prevent zoom on input focus
  preventZoom: () => {
    if (isIOS()) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      }
    }
  }
};

// iOS Status Bar Control (for PWA)
export const statusBar = {
  setStyle: (style = 'default') => {
    const meta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (meta) {
      // Options: default, black, black-translucent
      meta.content = style;
    }
  },
  
  setColor: (color) => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = color;
    }
  }
};

// iOS Safe Area Detection
export const getSafeAreaInsets = () => {
  const computedStyle = getComputedStyle(document.documentElement);
  return {
    top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top')) || 0,
    right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right')) || 0,
    bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom')) || 0,
    left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left')) || 0
  };
};

// iOS Animation Performance
export const optimizeAnimation = (element) => {
  if (isIOS()) {
    element.style.transform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
    element.style.willChange = 'transform';
  }
};

// iOS Long Press Handler
export const createLongPressHandler = (element, callback, duration = 500) => {
  let pressTimer = null;
  let isLongPress = false;
  
  const handleStart = (e) => {
    pressTimer = setTimeout(() => {
      isLongPress = true;
      hapticFeedback.heavy();
      callback(e);
    }, duration);
  };
  
  const handleEnd = () => {
    clearTimeout(pressTimer);
    isLongPress = false;
  };
  
  const handleMove = () => {
    clearTimeout(pressTimer);
  };
  
  element.addEventListener('touchstart', handleStart, { passive: true });
  element.addEventListener('touchend', handleEnd, { passive: true });
  element.addEventListener('touchmove', handleMove, { passive: true });
  element.addEventListener('touchcancel', handleEnd, { passive: true });
  
  return () => {
    element.removeEventListener('touchstart', handleStart);
    element.removeEventListener('touchend', handleEnd);
    element.removeEventListener('touchmove', handleMove);
    element.removeEventListener('touchcancel', handleEnd);
  };
};

// Export all features
export default {
  isIOS,
  isPWA,
  hapticFeedback,
  createSwipeHandler,
  createPullToRefresh,
  iosKeyboard,
  statusBar,
  getSafeAreaInsets,
  optimizeAnimation,
  createLongPressHandler
};