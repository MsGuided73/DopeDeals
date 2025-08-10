export function ComplianceRuleManager() {
  return (
    <div className="compliance-rule-manager">
      <div className="rule-categories">
        <RuleCategory title="Age Restrictions">
          <AgeRuleEditor />
        </RuleCategory>
        
        <RuleCategory title="Shipping Restrictions">
          <StateRestrictionEditor />
          <PACTActRuleEditor />
        </RuleCategory>
        
        <RuleCategory title="Product Classifications">
          <ProductTypeRuleEditor />
          <LabTestingRuleEditor />
        </RuleCategory>
        
        <RuleCategory title="Warning Labels">
          <WarningLabelEditor />
        </RuleCategory>
      </div>
      
      <ComplianceRulePreview />
    </div>
  );
}