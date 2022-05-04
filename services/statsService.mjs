import { getStatsById, makePayment } from "./databaseService.mjs";

export const getUsage = async (req, res) => {
  const usage = await getUsageById(req.userId)
  res.render("usage", { name: req.username, csrfToken: req.csrfToken(), usage })
}

export const getBilling = async (req, res) => {
  const billingAmount = await getBillingAmountById(req.userId)
  res.render("billing", { name: req.username, csrfToken: req.csrfToken(), billingAmount })
}

export const postPayment = async (req, res) => {
  const { paymentAmount } = req.body;
  const result = await makePayment(req.userId, paymentAmount)
  
  // check for errors
  if (result.error) {
    res.status(500)
    res.send(result.error)
  } else {
    res.render("billing", { name: req.username, csrfToken: req.csrfToken(), billingAmount: result })
  }
}

const getUsageById = async (id) => {
    const stats = await getStatsById(id)
    return stats.usageMB
}

const getBillingAmountById = async (id) => {
    const stats = await getStatsById(id)
    return stats.billingAmount
}