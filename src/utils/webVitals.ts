
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

import { logger } from "@/utils/logger";
interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

class WebVitalsMonitor {
  private metrics: VitalMetric[] = [];
  private analyticsEndpoint = '/api/analytics/vitals';

  constructor() {
    this.initializeVitalsTracking();
  }

  private initializeVitalsTracking() {
    // Track Core Web Vitals
    onCLS(this.handleVital.bind(this));
    onINP(this.handleVital.bind(this)); // INP replaced FID
    onFCP(this.handleVital.bind(this));
    onLCP(this.handleVital.bind(this));
    onTTFB(this.handleVital.bind(this));

    // Track custom performance metrics
    this.trackCustomMetrics();
  }

  private handleVital(metric: any) {
    const vital: VitalMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id
    };

    this.metrics.push(vital);
    this.logVital(vital);
    this.sendVitalToAnalytics(vital);
  }

  private logVital(vital: VitalMetric) {
    const color = vital.rating === 'good' ? '🟢' : vital.rating === 'needs-improvement' ? '🟡' : '🔴';
    logger.log(`${color} ${vital.name}: ${vital.value.toFixed(2)}ms (${vital.rating})`);
  }

  private async sendVitalToAnalytics(vital: VitalMetric) {
    try {
      // In a real app, you'd send this to your analytics service
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          ...vital,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        });
        
        navigator.sendBeacon(this.analyticsEndpoint, data);
      }
    } catch (error) {
      console.error('Failed to send vital to analytics:', error);
    }
  }

  private trackCustomMetrics() {
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.handleVital({
        name: 'PAGE_LOAD',
        value: loadTime,
        rating: loadTime < 2000 ? 'good' : loadTime < 4000 ? 'needs-improvement' : 'poor',
        delta: loadTime,
        id: 'page-load-' + Date.now()
      });
    });

    // Track memory usage if available
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMemory = memory.usedJSHeapSize / (1024 * 1024); // MB
        
        if (usedMemory > 50) { // Alert if over 50MB
          console.warn(`High memory usage: ${usedMemory.toFixed(2)}MB`);
        }
      }, 30000); // Check every 30 seconds
    }
  }

  getMetrics(): VitalMetric[] {
    return [...this.metrics];
  }

  getAverageMetric(name: string): number {
    const relevantMetrics = this.metrics.filter(m => m.name === name);
    if (relevantMetrics.length === 0) return 0;
    
    return relevantMetrics.reduce((sum, m) => sum + m.value, 0) / relevantMetrics.length;
  }

  getPerformanceScore(): number {
    const weights = {
      LCP: 0.25,   // Largest Contentful Paint
      INP: 0.25,   // Interaction to Next Paint (replaced FID)
      CLS: 0.25,   // Cumulative Layout Shift
      FCP: 0.15,   // First Contentful Paint
      TTFB: 0.1    // Time to First Byte
    };

    let score = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([metric, weight]) => {
      const vital = this.metrics.find(m => m.name === metric);
      if (vital) {
        const metricScore = vital.rating === 'good' ? 100 : vital.rating === 'needs-improvement' ? 75 : 50;
        score += metricScore * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(score / totalWeight) : 0;
  }
}

// Initialize Web Vitals monitoring
export const webVitalsMonitor = new WebVitalsMonitor();

// Export utility functions
export const getPerformanceInsights = () => {
  const metrics = webVitalsMonitor.getMetrics();
  const score = webVitalsMonitor.getPerformanceScore();
  
  return {
    metrics,
    score,
    recommendations: generateRecommendations(metrics, score)
  };
};

function generateRecommendations(metrics: VitalMetric[], score: number): string[] {
  const recommendations: string[] = [];
  
  if (score < 70) {
    recommendations.push('Celkový výkon aplikace potřebuje zlepšení');
  }
  
  metrics.forEach(metric => {
    if (metric.rating === 'poor') {
      switch (metric.name) {
        case 'LCP':
          recommendations.push('Optimalizujte načítání hlavního obsahu (LCP)');
          break;
        case 'INP':
          recommendations.push('Zlepšete rychlost reakce na uživatelské akce (INP)');
          break;
        case 'CLS':
          recommendations.push('Snižte neočekávané posuny layoutu (CLS)');
          break;
        case 'FCP':
          recommendations.push('Urychlete první vykreslení obsahu (FCP)');
          break;
        case 'TTFB':
          recommendations.push('Optimalizujte serverovou odezvu (TTFB)');
          break;
      }
    }
  });
  
  return recommendations;
}
