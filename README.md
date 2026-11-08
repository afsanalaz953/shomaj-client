
#🌍 Shomaj-Social Events Hub

Shomaj is a modern, community-driven space where people discover, create, and join social events happening around them. Whether it's a tree plantation drive, a blood donation camp, a food drive, or an elderly care visit, users can browse upcoming events, register with a single click, and keep track of everything they've joined — all in one clean, intuitive dashboard. Built with security at its core, the platform protects user identity and personal information through industry-standard authentication and encrypted sessions, so members can focus on what matters most: coming together and making a difference.

## ✨ Key features

# Browse & Discover Events — Explore a curated feed of upcoming social events with details like title, category, location, date, and description.

# Create Your Own Event — Any authenticated user can host an event by filling out a simple form, instantly making it visible to the community.

# One-Click Join — Join any event with a single action; the platform prevents duplicate joins using a unique compound index per user-event pair.

# My Joined Events Dashboard — A personal section where users see every event they've joined, complete with join date and full event details.

# Detailed Event Pages — Dedicated routes for each event showing imagery, category badges, venue, date, description, and registration count.

# Duplicate Join Protection — Server-side checks and MongoDB unique indexes guarantee a user can only join an event once, even under race conditions.

# Smart Event Validation — Events are verified against the database before joining, so users never register for non-existent or removed events.

# Rich Location Display — Multi-part locations (venue, area, city) are elegantly formatted, with graceful fallbacks when data is missing.

# Responsive, Accessible UI — Fully responsive layouts with accessible components, keyboard navigation, and screen-reader support.


🛠️ Technology Stack
> TypeScript 

> Next.js (App Router) 

> Express.js 

> Better Auth

> JWT (JSON Web Tokens) 

> MongoDB 

> Tailwind CSS

> shadcn/ui 



*=> Live Link
https://shomaj-client.vercel.app