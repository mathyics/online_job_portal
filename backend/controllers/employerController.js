const pool = require('../config/db');

// ✅ Create or Update Employer Profile
exports.createOrUpdateEmployer = async (req, res) => {
  try {
    const employer_id = req.user.id; // from JWT token
    const { company_name, industry, website, address, position_title } = req.body;

    if (!company_name) {
      return res.status(400).json({ message: "company_name required" });
    }

    // Insert or update company
    const companyQuery = `
      INSERT INTO Company (company_name, industry, website, address)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE industry=?, website=?, address=?`;

    await pool.query(companyQuery, [company_name, industry, website, address, industry, website, address]);

    // Get the company_id
    const [companyRows] = await pool.query("SELECT company_id FROM Company WHERE company_name = ?", [company_name]);
    const company_id = companyRows[0].company_id;

    // Insert or update employer record
    const employerQuery = `
      INSERT INTO Employee (employer_id, company_id, position_title)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE company_id=?, position_title=?`;

    await pool.query(employerQuery, [employer_id, company_id, position_title, company_id, position_title]);

    res.json({ message: "Employer profile created or updated successfully" });
  } catch (error) {
    console.error("Error creating employer profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Employer Profile by ID
exports.getEmployerProfile = async (req, res) => {
  try {
    const employer_id = req.params.id;
    const [rows] = await pool.query(`
      SELECT e.employer_id, e.position_title, c.company_name, c.industry, c.website, c.address
      FROM Employee e
      JOIN Company c ON e.company_id = c.company_id
      WHERE e.employer_id = ?`, [employer_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employer profile not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching employer profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
