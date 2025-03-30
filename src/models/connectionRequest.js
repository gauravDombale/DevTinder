const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        status: {
            type: String,
            enum: {
                values:["pending", "ignored", "interested", "accepted", "rejected"],
                message: "{VALUE} is not a valid status",
            },
            default: "pending",
            required: true,
        },
    },
    { timestamps: true }
);

//* pre hook to check if the fromUserId and toUserId are the same, this get called before saving the request
connectionRequestSchema.pre("save", function (next) {
    if (this.fromUserId.toString() === this.toUserId.toString()) {
        next(new Error("Cannot send request to yourself"));
    } else {
        next();
    }
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
connectionRequestSchema.index({ toUserId: 1, fromUserId: 1 });

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
