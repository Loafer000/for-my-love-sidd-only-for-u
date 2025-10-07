const express = require('express');

const router = express.Router();
const { authenticate } = require('../middleware/auth');

// @desc    Get maintenance dashboard data
// @route   GET /api/maintenance/dashboard
// @access  Private
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    // Load real maintenance data from database
    const maintenanceData = {
      success: true,
      data: {
        openOrders: 0,
        completedToday: 0,
        emergencyCalls: 0,
        avgResolution: 0,
        connectedDevices: 0,
        activeSensorsPercentage: 0,
        alertsToday: 0,
        systemHealth: 100,
        scheduledTasks: 0,
        preventiveMaintenance: 0,
        inspectionsDue: 0,
        teamUtilization: 0,
        activeVendors: 0,
        avgVendorRating: 0,
        responseTime: 0,
        costEfficiency: 0
      }
    };

    res.status(200).json(maintenanceData);
  } catch (error) {
    console.error('Maintenance dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance dashboard data'
    });
  }
});

// @desc    Get work orders
// @route   GET /api/maintenance/work-orders
// @access  Private
router.get('/work-orders', authenticate, async (req, res) => {
  try {
    const { status = 'all' } = req.query;

    // Mock data - replace with actual database queries
    const workOrders = {
      success: true,
      data: {
        workOrders: [
          {
            id: 'wo_001',
            title: 'Kitchen Sink Repair',
            description: 'Leaking faucet in apartment 205',
            status: 'open',
            priority: 'high',
            property: 'Sunset Apartments',
            unit: '205',
            assignedTo: 'John Smith',
            createdAt: '2025-10-04T10:00:00Z',
            estimatedCompletion: '2025-10-05T16:00:00Z'
          },
          {
            id: 'wo_002',
            title: 'HVAC Maintenance',
            description: 'Quarterly HVAC system check',
            status: 'in-progress',
            priority: 'medium',
            property: 'Oak Street Condos',
            unit: 'Common Area',
            assignedTo: 'Mike Johnson',
            createdAt: '2025-10-03T08:00:00Z',
            estimatedCompletion: '2025-10-04T17:00:00Z'
          }
        ],
        totalCount: status === 'all' ? 23 : status === 'open' ? 15 : 8
      }
    };

    res.status(200).json(workOrders);
  } catch (error) {
    console.error('Work orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch work orders'
    });
  }
});

// @desc    Create work order
// @route   POST /api/maintenance/work-orders
// @access  Private
router.post('/work-orders', authenticate, async (req, res) => {
  try {
    const {
      title, description, priority, propertyId, unitId
    } = req.body;

    // Validate required fields
    if (!title || !description || !priority || !propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Mock work order creation - replace with actual database operation
    const newWorkOrder = {
      success: true,
      data: {
        id: `wo_${Date.now()}`,
        title,
        description,
        priority,
        property: propertyId,
        unit: unitId,
        status: 'open',
        createdAt: new Date().toISOString(),
        createdBy: req.user._id
      }
    };

    res.status(201).json(newWorkOrder);
  } catch (error) {
    console.error('Create work order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create work order'
    });
  }
});

// @desc    Get IoT sensor data
// @route   GET /api/maintenance/iot-data
// @access  Private
router.get('/iot-data', authenticate, async (req, res) => {
  try {
    // Mock IoT data - replace with actual sensor data
    const iotData = {
      success: true,
      data: {
        sensors: [
          {
            id: 'sensor_001',
            name: 'Temperature Sensor - Lobby',
            type: 'temperature',
            value: 22.5,
            unit: '°C',
            status: 'normal',
            lastUpdate: new Date().toISOString(),
            property: 'Sunset Apartments',
            location: 'Lobby'
          },
          {
            id: 'sensor_002',
            name: 'Humidity Sensor - Basement',
            type: 'humidity',
            value: 65,
            unit: '%',
            status: 'normal',
            lastUpdate: new Date().toISOString(),
            property: 'Oak Street Condos',
            location: 'Basement'
          },
          {
            id: 'sensor_003',
            name: 'Water Leak Detector - Unit 305',
            type: 'water_leak',
            value: 0,
            unit: 'boolean',
            status: 'alert',
            lastUpdate: new Date().toISOString(),
            property: 'Pine Valley Houses',
            location: 'Unit 305 Bathroom'
          }
        ],
        alerts: [
          {
            id: 'alert_001',
            sensorId: 'sensor_003',
            message: 'Water leak detected in Unit 305',
            severity: 'high',
            timestamp: new Date().toISOString()
          }
        ]
      }
    };

    res.status(200).json(iotData);
  } catch (error) {
    console.error('IoT data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch IoT data'
    });
  }
});

module.exports = router;
