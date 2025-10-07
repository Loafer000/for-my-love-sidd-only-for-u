import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.thresholds = {
      CLS: 0.1,      // Cumulative Layout Shift
      FID: 100,      // First Input Delay (ms)
      FCP: 1800,     // First Contentful Paint (ms)
      LCP: 2500,     // Largest Contentful Paint (ms)
      TTFB: 800      // Time to First Byte (ms)
    };
    
    this.init();
  }

  init() {
    // Collect Web Vitals metrics
    getCLS(this.recordMetric.bind(this, 'CLS'));
    getFID(this.recordMetric.bind(this, 'FID'));
    getFCP(this.recordMetric.bind(this, 'FCP'));
    getLCP(this.recordMetric.bind(this, 'LCP'));
    getTTFB(this.recordMetric.bind(this, 'TTFB'));

    // Monitor custom metrics
    this.monitorCustomMetrics();
  }

  recordMetric(name, metric) {
    this.metrics[name] = metric;
    
    // Check against thresholds
    const threshold = this.thresholds[name];
    const value = metric.value;
    
    if (value > threshold) {
      console.warn(`Performance warning: ${name} (${value}) exceeds threshold (${threshold})`);
      this.reportPoorPerformance(name, value, threshold);
    }

    // Send to analytics (in production)
    this.sendToAnalytics(name, metric);
  }

  monitorCustomMetrics() {
    // Bundle size monitoring
    this.checkBundleSize();
    
    // Memory usage monitoring
    this.monitorMemoryUsage();
    
    // API response time monitoring
    this.monitorAPIPerformance();
    
    // Component render time monitoring
    this.monitorComponentPerformance();
  }

  checkBundleSize() {
    if (performance.navigation) {
      const transferSize = performance.getEntriesByType('navigation')[0]?.transferSize;
      if (transferSize > 1024 * 1024) { // 1MB threshold
        console.warn('Large bundle size detected:', transferSize / 1024, 'KB');
      }
    }
  }

  monitorMemoryUsage() {
    if (performance.memory) {
      const checkMemory = () => {
        const memory = performance.memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
        
        if (usedMB > 100) { // 100MB threshold
          console.warn('High memory usage detected:', usedMB, 'MB');
        }
        
        this.metrics.memoryUsage = { used: usedMB, total: totalMB };
      };
      
      // Check memory every 30 seconds
      setInterval(checkMemory, 30000);
      checkMemory(); // Initial check
    }
  }

  monitorAPIPerformance() {
    // Wrap fetch to monitor API calls
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Log slow API calls
        if (duration > 2000) { // 2 second threshold
          console.warn('Slow API call detected:', args[0], duration, 'ms');
        }
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.error('API call failed:', args[0], duration, 'ms', error);
        throw error;
      }
    };
  }

  monitorComponentPerformance() {
    // Monitor React component render times
    if (window.React && window.React.Profiler) {
      const onRenderCallback = (id, phase, actualDuration) => {
        if (actualDuration > 16) { // 16ms threshold for 60fps
          console.warn(`Slow component render: ${id} (${phase}) took ${actualDuration}ms`);
        }
      };
      
      // This would be integrated with React components in production
      this.metrics.componentRenders = [];
    }
  }

  reportPoorPerformance(metric, value, threshold) {
    // In production, send to monitoring service
    const report = {
      metric,
      value,
      threshold,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Send to monitoring service (e.g., Sentry, DataDog)
    console.log('Performance report:', report);
  }

  sendToAnalytics(name, metric) {
    // In production, send to Google Analytics or similar
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(metric.value),
        custom_map: {
          metric_id: metric.id,
          metric_delta: metric.delta
        }
      });
    }
  }

  getMetrics() {
    return this.metrics;
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.metrics,
      performance: {
        // Navigation timing
        domContentLoaded: performance.timing?.domContentLoadedEventEnd - performance.timing?.navigationStart,
        loadComplete: performance.timing?.loadEventEnd - performance.timing?.navigationStart,
        
        // Resource timing
        resources: performance.getEntriesByType('resource').map(entry => ({
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize
        }))
      }
    };
    
    return report;
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Export for use in tests and debugging
window.performanceMonitor = performanceMonitor;

export default performanceMonitor;