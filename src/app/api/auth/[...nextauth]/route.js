import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db";
import User, { USER_ROLES } from "@/models/User";

export const authOptions = {
    session: {
        strategy: "jwt",
    },

    providers: [
        // 🔐 Email + Password
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                await connectDB();

                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.passwordHash) {
                    throw new Error("Invalid email or password");
                }

                if (!user.isActive) {
                    throw new Error("Account disabled");
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isValid) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),

        // 🔐 Google OAuth
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                await connectDB();

                let dbUser = await User.findOne({ email: user.email });

                if (!dbUser) {
                    dbUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: USER_ROLES.USER,
                    });
                }

                // Attach MongoDB id temporarily
                user._dbId = dbUser._id.toString();
            }

            return true;
        },

        async jwt({ token, user }) {
            // On FIRST login only
            if (user?._dbId) {
                token.uid = user._dbId; // ✅ MongoDB _id ONLY
            }

            // Always sync role from DB
            if (token?.email) {
                await connectDB();
                const dbUser = await User.findOne({ email: token.email }).select("role");
                token.role = dbUser?.role || USER_ROLES.USER;
            }

            return token;
        },

        async session({ session, token }) {
            session.user.id = token.uid;   // ✅ MongoDB _id
            session.user.role = token.role;
            return session;
        },
    },


    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
