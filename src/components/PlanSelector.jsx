import { useState, useEffect } from 'react';
import { experiencePlans, go5gPlans, calculatePlanPricing, getRecommendedPlan } from '../data/experiencePlans';

function PlanSelector({ selectedPlan, onPlanChange, customerData, showRecommendation = true }) {
  const [activeTab, setActiveTab] = useState('experience');
  const [planDetails, setPlanDetails] = useState({});
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    // Calculate pricing for all plans
    const details = {};
    const allPlans = { ...experiencePlans, ...go5gPlans };
    
    Object.keys(allPlans).forEach(planId => {
      const plan = allPlans[planId];
      const discounts = ['autopay'];
      
      // Add applicable discounts based on customer data
      if (customerData.age55Plus) discounts.push('age55Plus');
      if (customerData.military) discounts.push('military');
      
      details[planId] = {
        ...plan,
        pricing: calculatePlanPricing(planId, customerData.lines || 1, discounts)
      };
    });
    
    setPlanDetails(details);

    // Get recommendation if enabled
    if (showRecommendation && customerData) {
      const rec = getRecommendedPlan({
        budget: customerData.budget || 'moderate',
        dataUsage: customerData.dataUsage || 'moderate',
        features: customerData.preferredFeatures || [],
        lineCount: customerData.lines || 1,
        age55Plus: customerData.age55Plus || false,
        military: customerData.military || false
      });
      setRecommendation(rec);
    }
  }, [customerData, showRecommendation]);

  const handlePlanSelect = (planId) => {
    const planInfo = planDetails[planId];
    if (planInfo) {
      onPlanChange({
        planId: planId,
        planName: planInfo.name,
        pricing: planInfo.pricing,
        features: planInfo.features
      });
    }
  };

  const getPlansForTab = (tab) => {
    switch(tab) {
      case 'experience':
        return Object.keys(experiencePlans).map(id => ({ id, ...planDetails[id] }));
      case 'go5g':
        return Object.keys(go5gPlans).map(id => ({ id, ...planDetails[id] }));
      default:
        return [];
    }
  };

  const formatPrice = (price) => {
    return price ? `$${Math.round(price)}` : 'N/A';
  };

  const getSavingsAmount = (planId) => {
    const pricing = planDetails[planId]?.pricing;
    if (!pricing) return 0;
    return pricing.discountAmount || 0;
  };

  return (
    <div className="plan-selector">
      <div className="plan-header">
        <h3>📱 Choose Your T-Mobile Plan</h3>
        <p>Select the best plan for your needs with current 2025 pricing</p>
      </div>

      {recommendation && showRecommendation && (
        <div className="recommendation-banner">
          <div className="rec-header">
            <span className="rec-icon">🎯</span>
            <span className="rec-title">Recommended for You</span>
          </div>
          <div className="rec-content">
            <h4>{recommendation.plan.name}</h4>
            <p>{recommendation.reason}</p>
            <div className="rec-pricing">
              <span className="rec-price">{formatPrice(recommendation.pricing?.finalPrice)}/mo</span>
              <span className="rec-per-line">({formatPrice(recommendation.pricing?.monthlyPerLine)}/line)</span>
            </div>
            <button 
              className="btn-rec"
              onClick={() => handlePlanSelect(recommendation.planId)}
            >
              Select Recommended Plan
            </button>
          </div>
        </div>
      )}

      <div className="plan-tabs">
        <button
          className={`tab ${activeTab === 'experience' ? 'active' : ''}`}
          onClick={() => setActiveTab('experience')}
        >
          Experience Plans
        </button>
        <button
          className={`tab ${activeTab === 'go5g' ? 'active' : ''}`}
          onClick={() => setActiveTab('go5g')}
        >
          GO5G Plans
        </button>
      </div>

      <div className="plan-grid">
        {getPlansForTab(activeTab).map(plan => {
          if (!plan.pricing) return null;
          
          const isSelected = selectedPlan?.planId === plan.id;
          const isRecommended = recommendation?.planId === plan.id;
          const savings = getSavingsAmount(plan.id);
          
          return (
            <div 
              key={plan.id}
              className={`plan-card ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              <div className="plan-card-header">
                <div className="plan-title">
                  <h4>{plan.name}</h4>
                  {isRecommended && <span className="rec-badge">Recommended</span>}
                  {plan.category === 'ultimate' && <span className="premium-badge">Premium</span>}
                </div>
                
                <div className="plan-pricing">
                  <div className="price-main">
                    {formatPrice(plan.pricing.finalPrice)}
                    <span className="price-period">/mo</span>
                  </div>
                  {plan.pricing.basePrice !== plan.pricing.finalPrice && (
                    <div className="price-original">
                      <span className="strikethrough">{formatPrice(plan.pricing.basePrice)}/mo</span>
                    </div>
                  )}
                  <div className="price-per-line">
                    {formatPrice(plan.pricing.monthlyPerLine)} per line
                  </div>
                  {savings > 0 && (
                    <div className="savings-amount">
                      Save {formatPrice(savings)}/mo
                    </div>
                  )}
                </div>
              </div>

              <div className="plan-features">
                <div className="feature-list">
                  <div className="feature-item">
                    📶 {plan.features?.priorityData || 'Unlimited'} Priority Data
                  </div>
                  {plan.features?.hotspotData && (
                    <div className="feature-item">
                      📡 {plan.features.hotspotData} Hotspot
                    </div>
                  )}
                  {plan.features?.streaming && (
                    <div className="feature-item">
                      📺 {plan.features.streaming} Streaming
                    </div>
                  )}
                  {plan.features?.netflix && (
                    <div className="feature-item premium">
                      🎬 {plan.features.netflix}
                    </div>
                  )}
                  {plan.features?.starlink && (
                    <div className="feature-item premium">
                      🛰️ T-Satellite with Starlink
                    </div>
                  )}
                  {plan.features?.deviceUpgrade && (
                    <div className="feature-item premium">
                      📱 {plan.features.deviceUpgrade}
                    </div>
                  )}
                  {plan.features?.internationalRoaming && (
                    <div className="feature-item">
                      🌍 {plan.features.internationalRoaming} Roaming
                    </div>
                  )}
                </div>
              </div>

              {customerData.lines > 1 && (
                <div className="family-pricing">
                  <div className="family-breakdown">
                    <span>Family of {customerData.lines}:</span>
                    <span className="family-total">{formatPrice(plan.pricing.finalPrice)}/mo total</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="plan-notes">
        <h4>💡 Plan Notes</h4>
        <ul>
          <li>All prices include $5/line AutoPay discount with eligible payment method</li>
          {customerData.age55Plus && <li>55+ pricing applied automatically</li>}
          {customerData.military && <li>Military/First Responder pricing applied automatically</li>}
          <li>Experience plans include T-Satellite with Starlink (limited time)</li>
          <li>Taxes & fees additional for all rate plans</li>
          <li>Data speeds may be reduced during network congestion</li>
        </ul>
      </div>

      <style jsx>{`
        .plan-selector {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin: 1rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .plan-header {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .plan-header h3 {
          margin: 0 0 0.5rem 0;
          color: var(--tmobile-magenta);
        }

        .plan-header p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .recommendation-banner {
          background: linear-gradient(135deg, rgba(226, 0, 116, 0.1), rgba(255, 107, 157, 0.1));
          border: 2px solid var(--tmobile-magenta);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .rec-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .rec-icon {
          font-size: 1.2rem;
        }

        .rec-title {
          font-weight: bold;
          color: var(--tmobile-magenta);
        }

        .rec-content h4 {
          margin: 0 0 0.25rem 0;
          color: var(--tmobile-magenta);
        }

        .rec-content p {
          margin: 0 0 0.5rem 0;
          color: #666;
          font-size: 0.9rem;
        }

        .rec-pricing {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .rec-price {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--tmobile-magenta);
        }

        .rec-per-line {
          color: #666;
          font-size: 0.9rem;
        }

        .btn-rec {
          background: var(--tmobile-magenta);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s;
        }

        .btn-rec:hover {
          background: rgba(226, 0, 116, 0.8);
        }

        .plan-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }

        .tab {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #666;
          transition: all 0.2s;
        }

        .tab.active {
          background: var(--tmobile-magenta);
          color: white;
        }

        .plan-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .plan-card {
          border: 2px solid #eee;
          border-radius: 8px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .plan-card:hover {
          border-color: var(--tmobile-magenta);
          box-shadow: 0 4px 12px rgba(226, 0, 116, 0.1);
        }

        .plan-card.selected {
          border-color: var(--tmobile-magenta);
          background: rgba(226, 0, 116, 0.02);
        }

        .plan-card.recommended {
          border-color: #ff6b9d;
          background: rgba(255, 107, 157, 0.02);
        }

        .plan-card-header {
          margin-bottom: 1rem;
        }

        .plan-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .plan-title h4 {
          margin: 0;
          color: var(--tmobile-magenta);
        }

        .rec-badge {
          background: #ff6b9d;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .premium-badge {
          background: #ffa500;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .plan-pricing {
          text-align: right;
        }

        .price-main {
          font-size: 1.8rem;
          font-weight: bold;
          color: var(--tmobile-magenta);
          line-height: 1;
        }

        .price-period {
          font-size: 1rem;
          color: #666;
        }

        .price-original {
          font-size: 0.9rem;
          color: #999;
          margin-top: 0.25rem;
        }

        .strikethrough {
          text-decoration: line-through;
        }

        .price-per-line {
          font-size: 0.8rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .savings-amount {
          font-size: 0.8rem;
          color: #28a745;
          font-weight: bold;
          margin-top: 0.25rem;
        }

        .plan-features {
          margin-bottom: 1rem;
        }

        .feature-list {
          display: grid;
          gap: 0.5rem;
        }

        .feature-item {
          font-size: 0.9rem;
          color: #333;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .feature-item.premium {
          color: var(--tmobile-magenta);
          font-weight: 600;
        }

        .family-pricing {
          border-top: 1px solid #eee;
          padding-top: 0.5rem;
        }

        .family-breakdown {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #666;
        }

        .family-total {
          font-weight: bold;
          color: var(--tmobile-magenta);
        }

        .plan-notes {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .plan-notes h4 {
          margin: 0 0 0.5rem 0;
          color: var(--tmobile-magenta);
        }

        .plan-notes ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .plan-notes li {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        @media (max-width: 768px) {
          .plan-grid {
            grid-template-columns: 1fr;
          }

          .rec-pricing {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default PlanSelector;