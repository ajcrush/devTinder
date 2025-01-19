const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../config/models/connectionRequest");
const sendEmail = require("./sendEmail");
cron.schedule("0 8 * * *", async () => {
  // Send email to all people who got request last day at 8 am morning everyday
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    // Find all requests made yesterday
    const pendingRequests = await ConnectionRequestModel.find({
      createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd },
    }).populate("fromUserId toUserId");
    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];
    console.log(listOfEmails);
    for (const email of listOfEmails) {
      try {
        const response = await sendEmail.run(
          "new friend request pending for " + email,
          "You have a new friend request pending from yesterday. Please check your account for more details"
        );
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
