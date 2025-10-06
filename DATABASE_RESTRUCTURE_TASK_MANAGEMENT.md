# Database Restructuring Task Management Plan

## Overview
This document outlines the comprehensive task management plan for restructuring the Dope City database schema to fix critical search and categorization issues.

## Current Status
- **Problem**: Search returns no results, categories empty, products not properly classified
- **Root Cause**: Inherited SigDistro schema incompatible with business needs
- **Data**: 4,579 products in database, 54 tables (46 after cleanup)
- **Timeline**: 3-week implementation plan

## 🎯 Week 1: Foundation - Database Schema Restructure

### Day 1: Database Cleanup & Assessment
**Status**: Pending
**Assigned**: Database Administrator
**Estimated Time**: 2-3 hours
**Dependencies**: None

#### Tasks:
- [ ] **Execute database cleanup script**
  - Run `scripts/cleanup-unused-tables.sql`
  - Remove 8 non-essential tables (emoji_* and concierge_*)
  - Verify database reduced from 54 to 46 tables

- [ ] **Verify current database state**
  - Confirm 4,579 products exist
  - Document current table structure
  - Identify data quality issues

- [ ] **Backup current database**
  - Create full database backup
  - Verify backup integrity
  - Document rollback procedure

**Success Criteria**:
- 8 tables successfully removed
- Database backup completed
- Current state documented

**Deliverables**:
- Database cleanup confirmation
- Current state documentation
- Backup verification report

---

### Day 2-3: Categories Table Restructure
**Status**: Pending
**Assigned**: Database Administrator
**Estimated Time**: 4-6 hours
**Dependencies**: Day 1 completion

#### Tasks:
- [ ] **Analyze existing category data**
  - Extract unique values from products.zoho_category_name
  - Identify current category patterns
  - Document inconsistencies

- [ ] **Design hierarchical structure**
  - Create main categories (Glass Pieces, Consumables, etc.)
  - Define subcategory relationships
  - Plan sort_order for display

- [ ] **Create category migration script**
  - Build script to populate categories table
  - Include slug generation
  - Add category metadata

- [ ] **Execute and verify migration**
  - Run category population script
  - Verify hierarchical relationships
  - Test category-based queries

**Success Criteria**:
- Categories table populated with 15+ main categories
- Hierarchical structure working
- All categories have proper slugs

**Deliverables**:
- Category migration script
- Category structure documentation
- Verification report

---

### Day 4: Brands Table Enhancement
**Status**: Pending
**Assigned**: Database Administrator
**Estimated Time**: 3-4 hours
**Dependencies**: Categories table completed

#### Tasks:
- [ ] **Extract unique brands**
  - Query distinct brand_name and manufacturer values
  - Clean and standardize brand names
  - Identify brand tier classifications

- [ ] **Create brand migration script**
  - Generate brand records with slugs
  - Assign tier classifications
  - Add brand metadata

- [ ] **Execute brand population**
  - Run brand migration script
  - Verify 100+ brands created
  - Test brand-based filtering

**Success Criteria**:
- 100+ brands properly organized
- Tier system implemented
- Brand filtering functional

**Deliverables**:
- Brand migration script
- Brand organization report

---

### Day 5: Products Table Relationship Updates
**Status**: Pending
**Assigned**: Database Administrator
**Estimated Time**: 4-5 hours
**Dependencies**: Categories and brands completed

#### Tasks:
- [ ] **Create product relationship migration**
  - Map zoho_category_name to category_id
  - Map brand_name/manufacturer to brand_id
  - Handle missing relationships

- [ ] **Add missing product fields**
  - Add Dope Club pricing fields
  - Add compliance fields
  - Add blog relationship fields

- [ ] **Execute relationship updates**
  - Run relationship mapping script
  - Verify all products have relationships
  - Test basic search functionality

**Success Criteria**:
- All products have category_id and brand_id
- Dope Club pricing structure added
- Basic search working

**Deliverables**:
- Product migration script
- Relationship verification report

## 🔒 Week 2: Security & Integration

### Day 6-7: Row Level Security (RLS) Implementation
**Status**: Pending
**Assigned**: Database Administrator
**Estimated Time**: 4-6 hours
**Dependencies**: Week 1 completion

#### Tasks:
- [ ] **Create RLS helper functions**
  - Implement is_admin_user() function
  - Create check_user_age_verification() function
  - Add geographic restriction checking

- [ ] **Implement products table RLS**
  - Enable RLS on products table
  - Create public read policy
  - Add admin access policy

- [ ] **Implement VIP products RLS**
  - Enable RLS on vip_smoke_products
  - Create authentication requirement
  - Add age verification policy

- [ ] **Test RLS functionality**
  - Verify public product access
  - Test user privacy protection
  - Confirm admin access

**Success Criteria**:
- All RLS policies active
- Security functions working
- Access controls verified

**Deliverables**:
- RLS implementation scripts
- Security testing report

---

### Day 8: Returns & Exchanges Workflow
**Status**: Pending
**Assigned**: Backend Developer
**Estimated Time**: 3-4 hours
**Dependencies**: RLS implementation

#### Tasks:
- [ ] **Create returns table structure**
  - Basic returns for eligible products
  - Consumables excluded due to regulations
  - Proper status tracking

- [ ] **Build return API endpoints**
  - Return request handling
  - Admin approval workflow
  - Refund processing

- [ ] **Test return functionality**
  - Create test return scenarios
  - Verify approval process
  - Test refund calculations

**Success Criteria**:
- Returns table created
- API endpoints functional
- Return policies enforced

**Deliverables**:
- Returns API implementation
- Return policy documentation

---

### Day 9-10: ShipStation Integration Enhancement
**Status**: Pending
**Assigned**: Backend Developer
**Estimated Time**: 4-6 hours
**Dependencies**: Returns workflow

#### Tasks:
- [ ] **Enhance ShipStation tables**
  - Add missing integration fields
  - Configure webhook processing
  - Create performance indexes

- [ ] **Set up API integration structure**
  - Prepare API credential storage
  - Configure webhook endpoints
  - Design order fulfillment automation

- [ ] **Test integration structure**
  - Verify table enhancements
  - Test webhook processing
  - Validate API structure

**Success Criteria**:
- ShipStation tables enhanced
- Integration structure ready
- Webhook processing configured

**Deliverables**:
- ShipStation enhancement scripts
- Integration setup documentation

## 🔍 Week 3: Testing & Launch Preparation

### Day 11-12: Comprehensive Testing
**Status**: Pending
**Assigned**: QA Team
**Estimated Time**: 4-6 hours
**Dependencies**: Week 2 completion

#### Tasks:
- [ ] **Create testing framework**
  - Build product search scenarios
  - Create category navigation tests
  - Design brand filtering tests

- [ ] **Execute database integrity tests**
  - Verify product relationships
  - Test category hierarchy
  - Check brand organization

- [ ] **Test search functionality**
  - Test various search keywords
  - Verify category filtering
  - Confirm brand filtering

- [ ] **Test RLS security**
  - Verify public access
  - Test user privacy
  - Confirm admin controls

**Success Criteria**:
- All tests passing
- Search functionality verified
- Security policies working

**Deliverables**:
- Test results report
- Functionality verification

---

### Day 13-14: ShipStation Launch Configuration
**Status**: Pending
**Assigned**: Operations Team
**Estimated Time**: 4-6 hours
**Dependencies**: Testing completion

#### Tasks:
- [ ] **Configure ShipStation credentials**
  - Set up API keys in environment
  - Test API connectivity
  - Verify webhook configuration

- [ ] **Set up shipping rules**
  - Configure shipping zones
  - Set up rate structures
  - Define packaging options

- [ ] **Configure fulfillment automation**
  - Set up order export
  - Configure status updates
  - Test tracking integration

**Success Criteria**:
- ShipStation ready for activation
- Shipping rules configured
- Fulfillment automation working

**Deliverables**:
- ShipStation configuration guide
- Launch readiness report

---

### Day 15: Performance Optimization & Documentation
**Status**: Pending
**Assigned**: Database Administrator
**Estimated Time**: 3-4 hours
**Dependencies**: All functionality tested

#### Tasks:
- [ ] **Add performance indexes**
  - Create search performance indexes
  - Add category/brand lookup indexes
  - Optimize frequently queried fields

- [ ] **Set up monitoring**
  - Create performance monitoring
  - Set up error tracking
  - Configure search analytics

- [ ] **Create maintenance documentation**
  - Document all configurations
  - Create troubleshooting guide
  - Set up maintenance procedures

**Success Criteria**:
- Performance optimized
- Monitoring in place
- Documentation complete

**Deliverables**:
- Performance optimization report
- Maintenance documentation
- Launch checklist

## 📊 Success Metrics & Validation

### Technical Validation:
- [ ] **Search Success Rate**: >95% of searches return relevant results
- [ ] **Category Accuracy**: >98% of products properly categorized
- [ ] **Performance**: <500ms search response, <2s page loads
- [ ] **Security**: All RLS policies active and functional

### Business Validation:
- [ ] **Customer Experience**: Functional search and filtering
- [ ] **Operational Efficiency**: Reduced manual maintenance
- [ ] **Compliance**: Automated age verification working
- [ ] **Scalability**: Ready for business growth

## 🛠️ Required Resources

### Team Assignments:
- **Database Administrator**: Schema changes, RLS, performance
- **Backend Developer**: API endpoints, integration
- **Operations Team**: ShipStation configuration
- **QA Team**: Testing and validation

### Technical Requirements:
- **Database Access**: Full Supabase admin access
- **API Keys**: ShipStation credentials (when ready)
- **Testing Environment**: Staging environment for validation
- **Monitoring Tools**: Database performance monitoring

## ⚠️ Risk Management

### Rollback Plan:
- **Database Backups**: Daily backups before major changes
- **Migration Scripts**: Reversible with down() functions
- **Feature Flags**: Ability to disable new features if issues

### Testing Strategy:
- **Staged Rollout**: Test each component before proceeding
- **Parallel Systems**: Keep old system running during transition
- **User Acceptance**: Test with real user scenarios

## 📋 Documentation Updates Required

### Files to Update/Create:
- [ ] **DATABASE_RESTRUCTURE_TASK_MANAGEMENT.md** - This document
- [ ] **VIP_SMOKE_DATABASE_SCHEMA.md** - Update with new schema
- [ ] **COMPREHENSIVE_IMPLEMENTATION_PLAN.md** - Update with new timeline
- [ ] **MASTER_TODO_CONSOLIDATED.md** - Add database tasks
- [ ] **DEPLOYMENT_CHECKLIST.md** - Add database deployment steps

### Documentation Standards:
- **Update Frequency**: Weekly during implementation
- **Change Log**: Document all schema changes
- **Rollback Procedures**: Include in all documentation
- **Success Metrics**: Track and report progress

---

*Last Updated: October 6, 2025*
*Implementation Status: Planning Phase*
*Next Action: Begin Day 1 - Database Cleanup*
