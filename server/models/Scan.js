/**
 * Mongoose Scan History Model for PostGuard
 * Fulfills FSD-II Syllabus Sessions 21-23 (MongoDB Atlas, Schema Design, Aggregation).
 */
const mongoose = require('mongoose');

const FindingSchema = new mongoose.Schema({
  algorithm: { type: String, required: true },
  family: { type: String, required: true },
  key_size: { type: String },
  line: { type: Number },
  threat_level: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'SAFE'] },
  nist_status: { type: String }
});

const ScanSchema = new mongoose.Schema({
  scanId: { type: String, required: true, unique: true, index: true },
  projectName: { type: String, default: 'Custom-Codebase' },
  sector: { type: String, default: 'Enterprise Software' },
  readinessScore: { type: Number, required: true, min: 0, max: 100 },
  readinessGrade: { type: String, required: true },
  totalFindings: { type: Number, default: 0 },
  criticalCount: { type: Number, default: 0 },
  highCount: { type: Number, default: 0 },
  safeCount: { type: Number, default: 0 },
  moscaStatus: { type: String },
  vulnerabilityWindow: { type: Number, default: 0 },
  findings: [FindingSchema],
  cbomRef: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Aggregation helper to compute organizational quantum risk metrics
ScanSchema.statics.getRiskAggregate = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$readinessGrade',
        totalScans: { $sum: 1 },
        avgScore: { $avg: '$readinessScore' },
        totalCritical: { $sum: '$criticalCount' }
      }
    },
    { $sort: { avgScore: -1 } }
  ]);
};

module.exports = mongoose.models.Scan || mongoose.model('Scan', ScanSchema);
