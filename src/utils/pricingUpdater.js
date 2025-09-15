/**
 * T-Mobile Pricing Update Utility
 * 
 * This utility helps update T-Mobile pricing data files based on structured data
 * extracted from PDFs via AI processing.
 */

class PricingUpdater {
  constructor() {
    this.updatedData = {
      plans: {},
      devices: {},
      promotions: {},
      insuranceRates: {}
    };
    this.updateLog = [];
  }

  /**
   * Process extracted PDF data and generate updates
   * @param {Object} extractedData - Structured data from PDF processing
   * @returns {Object} Update summary and proposed changes
   */
  async processExtractedData(extractedData) {
    try {
      console.log('🔄 Processing extracted PDF data for pricing updates...');
      
      const updateSummary = {
        plansFound: 0,
        devicesFound: 0, 
        promotionsFound: 0,
        insuranceRatesFound: 0,
        proposedUpdates: [],
        warnings: [],
        errors: []
      };

      // Process plans if available
      if (extractedData.plans && Array.isArray(extractedData.plans)) {
        const planUpdates = await this.processPlans(extractedData.plans);
        updateSummary.plansFound = extractedData.plans.length;
        updateSummary.proposedUpdates.push(...planUpdates);
      }

      // Process devices if available
      if (extractedData.devices && Array.isArray(extractedData.devices)) {
        const deviceUpdates = await this.processDevices(extractedData.devices);
        updateSummary.devicesFound = extractedData.devices.length;
        updateSummary.proposedUpdates.push(...deviceUpdates);
      }

      // Process promotions if available
      if (extractedData.promotions && Array.isArray(extractedData.promotions)) {
        const promotionUpdates = await this.processPromotions(extractedData.promotions);
        updateSummary.promotionsFound = extractedData.promotions.length;
        updateSummary.proposedUpdates.push(...promotionUpdates);
      }

      // Process insurance rates if available
      if (extractedData.insuranceRates && Array.isArray(extractedData.insuranceRates)) {
        const insuranceUpdates = await this.processInsuranceRates(extractedData.insuranceRates);
        updateSummary.insuranceRatesFound = extractedData.insuranceRates.length;
        updateSummary.proposedUpdates.push(...insuranceUpdates);
      }

      // Add effective date information
      if (extractedData.effectiveDate) {
        updateSummary.effectiveDate = extractedData.effectiveDate;
      }

      // Add document type information
      if (extractedData.documentType) {
        updateSummary.documentType = extractedData.documentType;
      }

      console.log('✅ PDF data processing completed');
      console.log(`📊 Summary: ${updateSummary.plansFound} plans, ${updateSummary.devicesFound} devices, ${updateSummary.promotionsFound} promotions`);
      
      return updateSummary;

    } catch (error) {
      console.error('❌ Error processing extracted data:', error);
      throw new Error(`Failed to process extracted data: ${error.message}`);
    }
  }

  /**
   * Process plan data from PDF extraction
   */
  async processPlans(plans) {
    const updates = [];
    
    for (const plan of plans) {
      try {
        // Map plan name to internal ID
        const planId = this.mapPlanNameToId(plan.name);
        
        if (!planId) {
          this.updateLog.push({
            type: 'warning',
            message: `Unknown plan name: ${plan.name}`
          });
          continue;
        }

        const update = {
          type: 'plan_update',
          planId,
          planName: plan.name,
          changes: []
        };

        // Check for pricing updates
        if (plan.basePrice && typeof plan.basePrice === 'number') {
          update.changes.push({
            field: 'base_price',
            oldValue: 'TBD', // Would need current data to compare
            newValue: plan.basePrice,
            description: `Base price: $${plan.basePrice}`
          });
        }

        // Check for autopay pricing
        if (plan.finalPrice && typeof plan.finalPrice === 'number') {
          update.changes.push({
            field: 'autopay_price',
            oldValue: 'TBD',
            newValue: plan.finalPrice,
            description: `AutoPay price: $${plan.finalPrice}`
          });
        }

        // Check for features
        if (plan.features && Array.isArray(plan.features)) {
          update.changes.push({
            field: 'features',
            oldValue: 'TBD',
            newValue: plan.features,
            description: `Features: ${plan.features.join(', ')}`
          });
        }

        // Check for line pricing
        if (plan.lines && typeof plan.lines === 'object') {
          update.changes.push({
            field: 'line_pricing',
            oldValue: 'TBD',
            newValue: plan.lines,
            description: `Line pricing: ${Object.entries(plan.lines).map(([lines, price]) => `${lines} lines: $${price}`).join(', ')}`
          });
        }

        if (update.changes.length > 0) {
          updates.push(update);
        }

      } catch (error) {
        this.updateLog.push({
          type: 'error',
          message: `Error processing plan ${plan.name}: ${error.message}`
        });
      }
    }

    return updates;
  }

  /**
   * Process device data from PDF extraction
   */
  async processDevices(devices) {
    const updates = [];
    
    for (const device of devices) {
      try {
        const update = {
          type: 'device_update',
          deviceName: device.name,
          changes: []
        };

        // Check for retail price updates
        if (device.retailPrice && typeof device.retailPrice === 'number') {
          update.changes.push({
            field: 'retail_price',
            oldValue: 'TBD',
            newValue: device.retailPrice,
            description: `Retail price: $${device.retailPrice}`
          });
        }

        // Check for monthly financing
        if (device.monthlyFinancing && typeof device.monthlyFinancing === 'number') {
          update.changes.push({
            field: 'monthly_financing',
            oldValue: 'TBD', 
            newValue: device.monthlyFinancing,
            description: `Monthly financing: $${device.monthlyFinancing}/mo`
          });
        }

        // Check for storage options
        if (device.storage) {
          update.changes.push({
            field: 'storage',
            oldValue: 'TBD',
            newValue: device.storage,
            description: `Storage: ${device.storage}`
          });
        }

        // Check for brand/category
        if (device.brand) {
          update.changes.push({
            field: 'brand',
            oldValue: 'TBD',
            newValue: device.brand,
            description: `Brand: ${device.brand}`
          });
        }

        if (update.changes.length > 0) {
          updates.push(update);
        }

      } catch (error) {
        this.updateLog.push({
          type: 'error',
          message: `Error processing device ${device.name}: ${error.message}`
        });
      }
    }

    return updates;
  }

  /**
   * Process promotion data from PDF extraction
   */
  async processPromotions(promotions) {
    const updates = [];
    
    for (const promotion of promotions) {
      try {
        const update = {
          type: 'promotion_update',
          promotionName: promotion.name,
          changes: []
        };

        // Check for promotion value
        if (promotion.value && typeof promotion.value === 'number') {
          update.changes.push({
            field: 'value',
            oldValue: 'TBD',
            newValue: promotion.value,
            description: `Value: $${promotion.value}`
          });
        }

        // Check for description
        if (promotion.description) {
          update.changes.push({
            field: 'description',
            oldValue: 'TBD',
            newValue: promotion.description,
            description: `Description: ${promotion.description}`
          });
        }

        // Check for conditions
        if (promotion.conditions) {
          update.changes.push({
            field: 'conditions',
            oldValue: 'TBD',
            newValue: promotion.conditions,
            description: `Conditions: ${promotion.conditions}`
          });
        }

        // Check for applicable devices
        if (promotion.applicableDevices && Array.isArray(promotion.applicableDevices)) {
          update.changes.push({
            field: 'applicable_devices',
            oldValue: 'TBD',
            newValue: promotion.applicableDevices,
            description: `Applicable devices: ${promotion.applicableDevices.join(', ')}`
          });
        }

        if (update.changes.length > 0) {
          updates.push(update);
        }

      } catch (error) {
        this.updateLog.push({
          type: 'error',
          message: `Error processing promotion ${promotion.name}: ${error.message}`
        });
      }
    }

    return updates;
  }

  /**
   * Process insurance rate data from PDF extraction
   */
  async processInsuranceRates(insuranceRates) {
    const updates = [];
    
    for (const rate of insuranceRates) {
      try {
        const update = {
          type: 'insurance_update',
          tier: rate.tier,
          changes: []
        };

        // Check for monthly rate
        if (rate.monthlyRate && typeof rate.monthlyRate === 'number') {
          update.changes.push({
            field: 'monthly_rate',
            oldValue: 'TBD',
            newValue: rate.monthlyRate,
            description: `Monthly rate: $${rate.monthlyRate}`
          });
        }

        // Check for device categories
        if (rate.devices && Array.isArray(rate.devices)) {
          update.changes.push({
            field: 'devices',
            oldValue: 'TBD',
            newValue: rate.devices,
            description: `Devices: ${rate.devices.join(', ')}`
          });
        }

        if (update.changes.length > 0) {
          updates.push(update);
        }

      } catch (error) {
        this.updateLog.push({
          type: 'error',
          message: `Error processing insurance rate tier ${rate.tier}: ${error.message}`
        });
      }
    }

    return updates;
  }

  /**
   * Map plan names from PDFs to internal plan IDs
   */
  mapPlanNameToId(planName) {
    const nameMapping = {
      'Experience Beyond': 'EXPERIENCE_BEYOND',
      'Experience More': 'EXPERIENCE_MORE', 
      'Essentials': 'ESSENTIALS',
      'Essentials Saver': 'ESSENTIALS_SAVER',
      'Go5G Next': 'GO5G_NEXT', // Legacy - should warn user
      'Go5G Plus': 'GO5G_PLUS', // Legacy - should warn user
    };

    // Normalize plan name (case insensitive, remove extra spaces)
    const normalizedName = planName.trim().replace(/\s+/g, ' ');
    
    // Try exact match first
    if (nameMapping[normalizedName]) {
      return nameMapping[normalizedName];
    }

    // Try case-insensitive match
    for (const [name, id] of Object.entries(nameMapping)) {
      if (name.toLowerCase() === normalizedName.toLowerCase()) {
        return id;
      }
    }

    return null;
  }

  /**
   * Generate a backup of current data before applying updates
   */
  async generateBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return {
      timestamp,
      backup_id: `backup_${timestamp}`,
      message: 'Backup created before applying PDF pricing updates'
    };
  }

  /**
   * Validate proposed updates before applying
   */
  validateUpdates(updateSummary) {
    const validation = {
      isValid: true,
      warnings: [],
      errors: [],
      recommendations: []
    };

    // Check for reasonable price ranges
    for (const update of updateSummary.proposedUpdates) {
      if (update.type === 'plan_update') {
        for (const change of update.changes) {
          if (change.field === 'base_price' && (change.newValue < 10 || change.newValue > 200)) {
            validation.warnings.push(`Plan ${update.planName}: Base price $${change.newValue} seems unusual`);
          }
        }
      }
      
      if (update.type === 'device_update') {
        for (const change of update.changes) {
          if (change.field === 'retail_price' && (change.newValue < 100 || change.newValue > 3000)) {
            validation.warnings.push(`Device ${update.deviceName}: Retail price $${change.newValue} seems unusual`);
          }
        }
      }
    }

    // Check for legacy plan references
    for (const update of updateSummary.proposedUpdates) {
      if (update.type === 'plan_update' && (update.planId === 'GO5G_NEXT' || update.planId === 'GO5G_PLUS')) {
        validation.warnings.push(`Plan ${update.planName}: This appears to be a legacy plan that was discontinued in April 2025`);
        validation.recommendations.push('Consider mapping this to an equivalent Experience plan');
      }
    }

    return validation;
  }

  /**
   * Get update log for debugging
   */
  getUpdateLog() {
    return this.updateLog;
  }

  /**
   * Clear update log
   */
  clearUpdateLog() {
    this.updateLog = [];
  }
}

export default PricingUpdater;