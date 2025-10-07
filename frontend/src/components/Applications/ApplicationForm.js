import React, { useState, useRef } from 'react';
import './ApplicationForm.css';

const ApplicationForm = ({ propertyId = null, onSubmit = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    ssn: '',
    
    // Current Address
    currentAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      rentAmount: '',
      moveInDate: '',
      moveOutDate: '',
      landlordName: '',
      landlordPhone: '',
      reasonForMoving: ''
    },
    
    // Employment Information
    employment: {
      status: 'employed', // employed, self-employed, student, retired, unemployed
      employer: '',
      position: '',
      workAddress: '',
      supervisorName: '',
      supervisorPhone: '',
      monthlyIncome: '',
      employmentLength: '',
      previousEmployer: '',
      previousPosition: '',
      previousEmploymentLength: ''
    },
    
    // Financial Information
    financial: {
      monthlyIncome: '',
      otherIncome: '',
      bankName: '',
      accountType: 'checking',
      creditScore: '',
      bankruptcyHistory: false,
      evictionHistory: false,
      criminalHistory: false,
      pets: false,
      petType: '',
      petDescription: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
        email: ''
      }
    },
    
    // References
    references: [
      { name: '', relationship: '', phone: '', email: '', yearsKnown: '' },
      { name: '', relationship: '', phone: '', email: '', yearsKnown: '' }
    ],
    
    // Documents
    documents: {
      idDocument: null,
      incomeProof: null,
      bankStatements: null,
      employmentLetter: null,
      references: null
    },
    
    // Additional Information
    additional: {
      desiredMoveInDate: '',
      leaseTerm: '12', // months
      additionalOccupants: '',
      vehicleInfo: '',
      specialRequests: '',
      howDidYouHear: '',
      agreeToTerms: false,
      agreeToCredit: false
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRefs = useRef({});

  const steps = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Basic personal details',
      icon: '👤'
    },
    {
      id: 2,
      title: 'Current Housing',
      description: 'Current living situation',
      icon: '🏠'
    },
    {
      id: 3,
      title: 'Employment',
      description: 'Work and income details',
      icon: '💼'
    },
    {
      id: 4,
      title: 'Financial Info',
      description: 'Financial background',
      icon: '💰'
    },
    {
      id: 5,
      title: 'References',
      description: 'Personal references',
      icon: '👥'
    },
    {
      id: 6,
      title: 'Documents',
      description: 'Upload required documents',
      icon: '📄'
    },
    {
      id: 7,
      title: 'Review & Submit',
      description: 'Review and submit application',
      icon: '✓'
    }
  ];

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedFormData = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const updateArrayFormData = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const validateStep = (step) => {
    const stepErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) stepErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) stepErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) stepErrors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) stepErrors.email = 'Valid email is required';
        if (!formData.phone.trim()) stepErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) stepErrors.dateOfBirth = 'Date of birth is required';
        break;
      
      case 2:
        if (!formData.currentAddress.street.trim()) stepErrors.currentStreet = 'Current address is required';
        if (!formData.currentAddress.city.trim()) stepErrors.currentCity = 'City is required';
        if (!formData.currentAddress.state.trim()) stepErrors.currentState = 'State is required';
        break;
      
      case 3:
        if (formData.employment.status === 'employed') {
          if (!formData.employment.employer.trim()) stepErrors.employer = 'Employer is required';
          if (!formData.employment.position.trim()) stepErrors.position = 'Position is required';
          if (!formData.employment.monthlyIncome.trim()) stepErrors.monthlyIncome = 'Monthly income is required';
        }
        break;
      
      case 4:
        if (!formData.financial.monthlyIncome.trim()) stepErrors.financialIncome = 'Monthly income is required';
        if (!formData.financial.bankName.trim()) stepErrors.bankName = 'Bank name is required';
        break;
      
      case 7:
        if (!formData.additional.agreeToTerms) stepErrors.agreeToTerms = 'You must agree to terms';
        if (!formData.additional.agreeToCredit) stepErrors.agreeToCredit = 'You must agree to credit check';
        break;
    }
    
    return stepErrors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length === 0) {
      setErrors({});
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      setErrors(stepErrors);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFileUpload = async (documentType, file) => {
    if (!file) return;
    
    setUploadProgress(prev => ({ ...prev, [documentType]: 0 }));
    
    // Simulate file upload progress
    const uploadSimulation = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[documentType] || 0;
        const newProgress = currentProgress + 10;
        
        if (newProgress >= 100) {
          clearInterval(uploadSimulation);
          updateFormData('documents', documentType, {
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString()
          });
          return { ...prev, [documentType]: 100 };
        }
        
        return { ...prev, [documentType]: newProgress };
      });
    }, 200);
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(7);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const applicationData = {
        ...formData,
        propertyId: propertyId,
        submissionDate: new Date().toISOString(),
        status: 'submitted'
      };
      
      if (onSubmit) {
        onSubmit(applicationData);
      }
      
      console.log('Application submitted:', applicationData);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className={errors.dateOfBirth ? 'error' : ''}
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="ssn">Social Security Number (Last 4 digits)</label>
                <input
                  type="text"
                  id="ssn"
                  value={formData.ssn}
                  onChange={(e) => setFormData(prev => ({ ...prev, ssn: e.target.value }))}
                  placeholder="****"
                  maxLength="4"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Current Housing Information</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="currentStreet">Current Address *</label>
                <input
                  type="text"
                  id="currentStreet"
                  value={formData.currentAddress.street}
                  onChange={(e) => updateFormData('currentAddress', 'street', e.target.value)}
                  className={errors.currentStreet ? 'error' : ''}
                />
                {errors.currentStreet && <span className="error-message">{errors.currentStreet}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="currentCity">City *</label>
                <input
                  type="text"
                  id="currentCity"
                  value={formData.currentAddress.city}
                  onChange={(e) => updateFormData('currentAddress', 'city', e.target.value)}
                  className={errors.currentCity ? 'error' : ''}
                />
                {errors.currentCity && <span className="error-message">{errors.currentCity}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="currentState">State *</label>
                <input
                  type="text"
                  id="currentState"
                  value={formData.currentAddress.state}
                  onChange={(e) => updateFormData('currentAddress', 'state', e.target.value)}
                  className={errors.currentState ? 'error' : ''}
                />
                {errors.currentState && <span className="error-message">{errors.currentState}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="currentZip">Zip Code</label>
                <input
                  type="text"
                  id="currentZip"
                  value={formData.currentAddress.zipCode}
                  onChange={(e) => updateFormData('currentAddress', 'zipCode', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="currentRent">Current Rent Amount</label>
                <input
                  type="number"
                  id="currentRent"
                  value={formData.currentAddress.rentAmount}
                  onChange={(e) => updateFormData('currentAddress', 'rentAmount', e.target.value)}
                  placeholder="$0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="landlordName">Current Landlord Name</label>
                <input
                  type="text"
                  id="landlordName"
                  value={formData.currentAddress.landlordName}
                  onChange={(e) => updateFormData('currentAddress', 'landlordName', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="landlordPhone">Landlord Phone</label>
                <input
                  type="tel"
                  id="landlordPhone"
                  value={formData.currentAddress.landlordPhone}
                  onChange={(e) => updateFormData('currentAddress', 'landlordPhone', e.target.value)}
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="reasonForMoving">Reason for Moving</label>
                <textarea
                  id="reasonForMoving"
                  value={formData.currentAddress.reasonForMoving}
                  onChange={(e) => updateFormData('currentAddress', 'reasonForMoving', e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Employment Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="employmentStatus">Employment Status *</label>
                <select
                  id="employmentStatus"
                  value={formData.employment.status}
                  onChange={(e) => updateFormData('employment', 'status', e.target.value)}
                >
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                  <option value="unemployed">Unemployed</option>
                </select>
              </div>
              
              {formData.employment.status === 'employed' && (
                <>
                  <div className="form-group">
                    <label htmlFor="employer">Employer *</label>
                    <input
                      type="text"
                      id="employer"
                      value={formData.employment.employer}
                      onChange={(e) => updateFormData('employment', 'employer', e.target.value)}
                      className={errors.employer ? 'error' : ''}
                    />
                    {errors.employer && <span className="error-message">{errors.employer}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="position">Position/Title *</label>
                    <input
                      type="text"
                      id="position"
                      value={formData.employment.position}
                      onChange={(e) => updateFormData('employment', 'position', e.target.value)}
                      className={errors.position ? 'error' : ''}
                    />
                    {errors.position && <span className="error-message">{errors.position}</span>}
                  </div>
                  
                  <div className="form-group full-width">
                    <label htmlFor="workAddress">Work Address</label>
                    <input
                      type="text"
                      id="workAddress"
                      value={formData.employment.workAddress}
                      onChange={(e) => updateFormData('employment', 'workAddress', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="supervisorName">Supervisor Name</label>
                    <input
                      type="text"
                      id="supervisorName"
                      value={formData.employment.supervisorName}
                      onChange={(e) => updateFormData('employment', 'supervisorName', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="supervisorPhone">Supervisor Phone</label>
                    <input
                      type="tel"
                      id="supervisorPhone"
                      value={formData.employment.supervisorPhone}
                      onChange={(e) => updateFormData('employment', 'supervisorPhone', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="employmentLength">Years at Current Job</label>
                    <input
                      type="number"
                      id="employmentLength"
                      value={formData.employment.employmentLength}
                      onChange={(e) => updateFormData('employment', 'employmentLength', e.target.value)}
                      step="0.1"
                    />
                  </div>
                </>
              )}
              
              <div className="form-group">
                <label htmlFor="empMonthlyIncome">Monthly Gross Income *</label>
                <input
                  type="number"
                  id="empMonthlyIncome"
                  value={formData.employment.monthlyIncome}
                  onChange={(e) => updateFormData('employment', 'monthlyIncome', e.target.value)}
                  placeholder="$0"
                  className={errors.monthlyIncome ? 'error' : ''}
                />
                {errors.monthlyIncome && <span className="error-message">{errors.monthlyIncome}</span>}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>Financial Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="finMonthlyIncome">Total Monthly Income *</label>
                <input
                  type="number"
                  id="finMonthlyIncome"
                  value={formData.financial.monthlyIncome}
                  onChange={(e) => updateFormData('financial', 'monthlyIncome', e.target.value)}
                  placeholder="$0"
                  className={errors.financialIncome ? 'error' : ''}
                />
                {errors.financialIncome && <span className="error-message">{errors.financialIncome}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="otherIncome">Other Income Sources</label>
                <input
                  type="number"
                  id="otherIncome"
                  value={formData.financial.otherIncome}
                  onChange={(e) => updateFormData('financial', 'otherIncome', e.target.value)}
                  placeholder="$0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bankName">Primary Bank *</label>
                <input
                  type="text"
                  id="bankName"
                  value={formData.financial.bankName}
                  onChange={(e) => updateFormData('financial', 'bankName', e.target.value)}
                  className={errors.bankName ? 'error' : ''}
                />
                {errors.bankName && <span className="error-message">{errors.bankName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="accountType">Account Type</label>
                <select
                  id="accountType"
                  value={formData.financial.accountType}
                  onChange={(e) => updateFormData('financial', 'accountType', e.target.value)}
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="both">Both</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="creditScore">Estimated Credit Score</label>
                <select
                  id="creditScore"
                  value={formData.financial.creditScore}
                  onChange={(e) => updateFormData('financial', 'creditScore', e.target.value)}
                >
                  <option value="">Select Range</option>
                  <option value="excellent">Excellent (750+)</option>
                  <option value="good">Good (700-749)</option>
                  <option value="fair">Fair (650-699)</option>
                  <option value="poor">Poor (Below 650)</option>
                  <option value="unknown">I don't know</option>
                </select>
              </div>
              
              <div className="form-group full-width">
                <h4>Background Questions</h4>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.financial.bankruptcyHistory}
                      onChange={(e) => updateFormData('financial', 'bankruptcyHistory', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Have you filed for bankruptcy in the last 7 years?
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.financial.evictionHistory}
                      onChange={(e) => updateFormData('financial', 'evictionHistory', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Have you ever been evicted or asked to move?
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.financial.criminalHistory}
                      onChange={(e) => updateFormData('financial', 'criminalHistory', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Do you have any criminal history?
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.financial.pets}
                      onChange={(e) => updateFormData('financial', 'pets', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Do you have any pets?
                  </label>
                </div>
                
                {formData.financial.pets && (
                  <div className="pet-info">
                    <input
                      type="text"
                      placeholder="Pet type and breed"
                      value={formData.financial.petType}
                      onChange={(e) => updateFormData('financial', 'petType', e.target.value)}
                    />
                    <textarea
                      placeholder="Pet description, size, age, etc."
                      value={formData.financial.petDescription}
                      onChange={(e) => updateFormData('financial', 'petDescription', e.target.value)}
                      rows="2"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h3>Personal References</h3>
            {formData.references.map((reference, index) => (
              <div key={index} className="reference-section">
                <h4>Reference {index + 1}</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={reference.name}
                      onChange={(e) => updateArrayFormData('references', index, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Relationship</label>
                    <input
                      type="text"
                      value={reference.relationship}
                      onChange={(e) => updateArrayFormData('references', index, 'relationship', e.target.value)}
                      placeholder="Friend, Colleague, etc."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={reference.phone}
                      onChange={(e) => updateArrayFormData('references', index, 'phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={reference.email}
                      onChange={(e) => updateArrayFormData('references', index, 'email', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Years Known</label>
                    <input
                      type="number"
                      value={reference.yearsKnown}
                      onChange={(e) => updateArrayFormData('references', index, 'yearsKnown', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <h4 style={{ marginTop: '2rem' }}>Emergency Contact</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.financial.emergencyContact.name}
                  onChange={(e) => updateNestedFormData('financial', 'emergencyContact', 'name', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Relationship</label>
                <input
                  type="text"
                  value={formData.financial.emergencyContact.relationship}
                  onChange={(e) => updateNestedFormData('financial', 'emergencyContact', 'relationship', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData.financial.emergencyContact.phone}
                  onChange={(e) => updateNestedFormData('financial', 'emergencyContact', 'phone', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.financial.emergencyContact.email}
                  onChange={(e) => updateNestedFormData('financial', 'emergencyContact', 'email', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-content">
            <h3>Required Documents</h3>
            <div className="documents-grid">
              {[
                { key: 'idDocument', label: 'Government ID', required: true, description: 'Driver\'s license, passport, or state ID' },
                { key: 'incomeProof', label: 'Proof of Income', required: true, description: 'Recent pay stubs or tax returns' },
                { key: 'bankStatements', label: 'Bank Statements', required: true, description: 'Last 2-3 months of statements' },
                { key: 'employmentLetter', label: 'Employment Letter', required: false, description: 'Letter from employer (if applicable)' },
                { key: 'references', label: 'Reference Letters', required: false, description: 'Letters from personal references' }
              ].map(doc => (
                <div key={doc.key} className="document-upload">
                  <div className="document-info">
                    <h4>
                      {doc.label}
                      {doc.required && <span className="required">*</span>}
                    </h4>
                    <p>{doc.description}</p>
                  </div>
                  
                  <div className="upload-section">
                    {!formData.documents[doc.key] ? (
                      <>
                        <input
                          type="file"
                          ref={el => fileInputRefs.current[doc.key] = el}
                          onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          className="upload-btn"
                          onClick={() => fileInputRefs.current[doc.key].click()}
                        >
                          📁 Choose File
                        </button>
                        {uploadProgress[doc.key] !== undefined && (
                          <div className="upload-progress">
                            <div 
                              className="progress-bar"
                              style={{ width: `${uploadProgress[doc.key]}%` }}
                            />
                            <span>{uploadProgress[doc.key]}%</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="uploaded-file">
                        <div className="file-info">
                          <span className="file-name">{formData.documents[doc.key].name}</span>
                          <span className="file-size">
                            ({Math.round(formData.documents[doc.key].size / 1024)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => updateFormData('documents', doc.key, null)}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="step-content">
            <h3>Additional Information & Review</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="desiredMoveIn">Desired Move-In Date</label>
                <input
                  type="date"
                  id="desiredMoveIn"
                  value={formData.additional.desiredMoveInDate}
                  onChange={(e) => updateFormData('additional', 'desiredMoveInDate', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="leaseTerm">Preferred Lease Term</label>
                <select
                  id="leaseTerm"
                  value={formData.additional.leaseTerm}
                  onChange={(e) => updateFormData('additional', 'leaseTerm', e.target.value)}
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="additionalOccupants">Additional Occupants</label>
                <textarea
                  id="additionalOccupants"
                  value={formData.additional.additionalOccupants}
                  onChange={(e) => updateFormData('additional', 'additionalOccupants', e.target.value)}
                  placeholder="List any other people who will be living in the unit"
                  rows="2"
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="vehicleInfo">Vehicle Information</label>
                <textarea
                  id="vehicleInfo"
                  value={formData.additional.vehicleInfo}
                  onChange={(e) => updateFormData('additional', 'vehicleInfo', e.target.value)}
                  placeholder="Year, make, model, license plate (for parking purposes)"
                  rows="2"
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="specialRequests">Special Requests or Comments</label>
                <textarea
                  id="specialRequests"
                  value={formData.additional.specialRequests}
                  onChange={(e) => updateFormData('additional', 'specialRequests', e.target.value)}
                  placeholder="Any special accommodations or requests"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="howDidYouHear">How did you hear about us?</label>
                <select
                  id="howDidYouHear"
                  value={formData.additional.howDidYouHear}
                  onChange={(e) => updateFormData('additional', 'howDidYouHear', e.target.value)}
                >
                  <option value="">Select option</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social-media">Social Media</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group full-width">
                <div className="terms-section">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.additional.agreeToTerms}
                      onChange={(e) => updateFormData('additional', 'agreeToTerms', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    I agree to the terms and conditions and understand that false information may result in application denial *
                  </label>
                  {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.additional.agreeToCredit}
                      onChange={(e) => updateFormData('additional', 'agreeToCredit', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    I authorize a credit and background check as part of the application process *
                  </label>
                  {errors.agreeToCredit && <span className="error-message">{errors.agreeToCredit}</span>}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="application-form">
      <div className="form-container">
        {/* Progress Indicator */}
        <div className="progress-section">
          <div className="step-indicators">
            {steps.map(step => (
              <div 
                key={step.id}
                className={`step-indicator ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
              >
                <div className="step-number">
                  {currentStep > step.id ? '✓' : step.icon}
                </div>
                <div className="step-info">
                  <span className="step-title">{step.title}</span>
                  <span className="step-description">{step.description}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="form-section">
          <div className="step-header">
            <h2>{steps[currentStep - 1]?.title}</h2>
            <p>{steps[currentStep - 1]?.description}</p>
          </div>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            <button
              type="button"
              className="nav-btn prev"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              ← Previous
            </button>
            
            <span className="step-counter">
              Step {currentStep} of {steps.length}
            </span>
            
            {currentStep < steps.length ? (
              <button
                type="button"
                className="nav-btn next"
                onClick={nextStep}
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                className="nav-btn submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;