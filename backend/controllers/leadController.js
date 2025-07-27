const Lead = require('../models/Lead');
const Profile = require('../models/Profile');
const { validationResult } = require('express-validator');

// @desc    Capture lead from profile
// @route   POST /api/leads/capture
// @access  Public
const captureLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { 
      profileId, 
      name, 
      email, 
      phone, 
      company, 
      position, 
      source, 
      notes,
      location,
      device
    } = req.body;

    // Find profile
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Check if lead capture is enabled
    if (!profile.settings.allowLeadCapture) {
      return res.status(403).json({ message: 'Lead capture is disabled for this profile' });
    }

    // Create lead
    const lead = await Lead.create({
      profile: profileId,
      user: profile.user,
      name,
      email,
      phone,
      company,
      position,
      source,
      notes,
      location,
      device
    });

    // Calculate lead score
    await lead.calculateScore();

    // Increment profile lead count
    await profile.incrementLeads();

    // Add initial interaction
    await lead.addInteraction('form_submit', 'Lead captured from profile');

    res.status(201).json({
      message: 'Lead captured successfully',
      lead: {
        id: lead._id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        position: lead.position,
        source: lead.source,
        status: lead.status,
        score: lead.score,
        createdAt: lead.createdAt
      }
    });
  } catch (error) {
    console.error('Capture lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get leads for user
// @route   GET /api/leads
// @access  Private
const getMyLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, source, search } = req.query;

    // Build filter
    const filter = { user: req.user.id, isActive: true };
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (source && source !== 'all') {
      filter.source = source;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(filter)
      .populate('profile', 'username name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments(filter);

    // Get lead statistics
    const stats = await Lead.aggregate([
      { $match: { user: req.user.id, isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
          qualified: { $sum: { $cond: [{ $eq: ['$status', 'qualified'] }, 1, 0] } },
          converted: { $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] } },
          avgScore: { $avg: '$score' }
        }
      }
    ]);

    res.json({
      leads,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      },
      stats: stats[0] || {
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
        avgScore: 0
      }
    });
  } catch (error) {
    console.error('Get my leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate('profile', 'username name');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({ lead });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const lead = await Lead.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const {
      name,
      email,
      phone,
      company,
      position,
      status,
      notes,
      tags,
      nextFollowUp
    } = req.body;

    // Update fields
    if (name) lead.name = name;
    if (email) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (company !== undefined) lead.company = company;
    if (position !== undefined) lead.position = position;
    if (notes !== undefined) lead.notes = notes;
    if (tags) lead.tags = tags;
    if (nextFollowUp) lead.nextFollowUp = new Date(nextFollowUp);

    // Update status if provided
    if (status && status !== lead.status) {
      await lead.updateStatus(status);
    } else {
      await lead.save();
    }

    // Recalculate score
    await lead.calculateScore();

    res.json({
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.isActive = false;
    await lead.save();

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add interaction to lead
// @route   POST /api/leads/:id/interaction
// @access  Private
const addInteraction = async (req, res) => {
  try {
    const { type, details } = req.body;

    const lead = await Lead.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.addInteraction(type, details);
    await lead.calculateScore();

    res.json({
      message: 'Interaction added successfully',
      interactions: lead.interactions
    });
  } catch (error) {
    console.error('Add interaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get lead analytics
// @route   GET /api/leads/analytics
// @access  Private
const getLeadAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '90d':
        dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
        break;
      case '1y':
        dateFilter = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
        break;
    }

    const analytics = await Lead.aggregate([
      { 
        $match: { 
          user: req.user.id, 
          isActive: true,
          createdAt: dateFilter
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const sourceStats = await Lead.aggregate([
      { 
        $match: { 
          user: req.user.id, 
          isActive: true,
          createdAt: dateFilter
        } 
      },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const statusStats = await Lead.aggregate([
      { 
        $match: { 
          user: req.user.id, 
          isActive: true,
          createdAt: dateFilter
        } 
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      dailyStats: analytics,
      sourceStats,
      statusStats
    });
  } catch (error) {
    console.error('Get lead analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  captureLead,
  getMyLeads,
  getLead,
  updateLead,
  deleteLead,
  addInteraction,
  getLeadAnalytics
}; 