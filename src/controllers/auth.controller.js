import userModel from '../models/user.model.js'
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {
    const { username, email, password } = req.body;


    const isUserAlreadyExixts = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserAlreadyExixts) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })
    }


    const user = await userModel.create({ username, email, password });

    console.log("JWT_SECRET =", process.env.JWT_SECRET);
    const emailVerificationToken = jwt.sign({
        email: user.email,

    }, process.env.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity2.0",
        html: `
                <div style="max-width:600px;margin:0 auto;padding:40px;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;font-family:Arial,Helvetica,sans-serif;color:#374151;line-height:1.7;">

                <h1 style="margin-top:0;color:#111827;">
                    Welcome to Perplexity2.0
                </h1>

                <p>Hi <strong>${username || "there"}</strong>,</p>

                <p>
                    Thank you for signing up for <strong>Perplexity2.0</strong>.
                    Your account has been created successfully, and you're ready to get started.
                </p>

                <p>With Perplexity2.0, you can:</p>

                <ul>
                    <li>Ask AI-powered questions.</li>
                    <li>Save and manage your conversations.</li>
                    <li>Receive fast and accurate responses.</li>
                    <li>Continue conversations seamlessly.</li>
                </ul>

                <div style="text-align:center;margin:35px 0;">
                    <a
                    href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}"
                    style="background:#111827;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block;font-weight:600;"
                    >
                    Get Started
                    </a>
                </div>

                <p>
                    If you have any questions, we're always here to help.
                </p>

                <p>
                    Thank you for choosing Perplexity2.0.
                </p>

                <p style="margin-top:30px;">
                    Regards,<br>
                    <strong>Team Perplexity2.0</strong>
                </p>

                </div>
                `
    });


    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}




export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);





        const user = await userModel.findOne({ email: decoded.email });


        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }


        user.verified = true;
        await user.save();


        const html =    `
            <h1>Email Verified Successfully</h1>
            <p>Your email has been verified. You can now log in to your account.</p>
        `

        return res.send(html)
    }
    catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }

}


export async function login(req, res){
    const {email, password} = req.body;

    const user= await userModel.findOne({email});


    if(!user){
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message: "Please verify you email before loggin in",
            success: false,
            err: "Email not verified"
        })
    }

    const token= jwt.sign({
        id: user._id,
        username: user.username,

    }, process.env.JWT_SECRET, {expiresIn: "7d"});

    res.cookie("token", token);

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


export async function getMe(req, res){
    const userId= req.user.id;

    const user= await userModel.findById(userId).select("-password");


    if(!user){
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })

}