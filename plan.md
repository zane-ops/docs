# ZaneOps Cloud Landing Page - Implementation Plan

## Overview
Create a conversion-focused cloud landing page that showcases enterprise features, captures waitlist signups, and promotes sponsorship for early access.

## Requirements Summary
1. Feature showcase (9 cloud features - no free/paid labels)
2. Waitlist signup form
3. Sponsor invitation with tier benefits
4. Clean, conversion-focused design
5. Mobile responsive

## Page Structure

### 1. Hero Section
- **Headline**: "ZaneOps Cloud - Enterprise Features, Your Infrastructure"
- **Subheadline**: "Deploy with confidence using enterprise-grade features while keeping control of your data and servers"
- **Dual CTAs**:
  - Primary: "Join the Waitlist" (scroll to form)
  - Secondary: "Become a Sponsor" (scroll to sponsor section)
- **Visual**: ZaneOps logo

### 2. Value Proposition Section (3-column grid)
1. **Your Servers, Your Data** - Self-hosting benefits
2. **Managed Control Panel** - Cloud-hosted dashboard
3. **Enterprise Features** - Advanced capabilities

Icons: CloudUpload, ShieldCheck, Network from lucide

### 3. Feature Showcase (2-column responsive grid)
Display all 9 features without pricing labels:

1. **Multi-Tenancy** (Icon: Users)
   - "Organize projects with custom permissions for teams, groups, and workspaces"

2. **OIDC Authentication** (Icon: KeyRound)
   - "Enterprise-grade authentication with OpenID Connect support"

3. **Service URL Protection** (Icon: Lock)
   - "Secure your services with basic auth and OIDC protection"

4. **Social Authentication** (Icon: Github)
   - "Login with Google, Github, and other providers"

5. **Advanced Service Auth** (Icon: Shield)
   - "Protect services using social providers like GitHub and GitLab"

6. **Custom Branding** (Icon: Palette)
   - "Customize authentication pages with your brand identity"

7. **Audit Logs** (Icon: FileText)
   - "Track all activity: logins, deployments, service changes"

8. **Multi-Server Cluster** (Icon: Server)
   - "Deploy across multiple servers for high availability"

9. **Pre/Post Webhooks** (Icon: Webhook)
   - "Execute custom logic before and after deployments"

### 4. Waitlist Signup Form
**Form Fields**:
- Email (required)
- Name (required)
- Company/Project (optional)
- Use case (textarea, optional)
- Server count (dropdown: 1-2, 3-5, 6-10, 10+)

**Features**:
- Client-side validation
- Loading/success/error states
- POST to `/api/signup-cloud`
- Success message: "Thanks! We'll notify you when cloud access is available"

### 5. Sponsor CTA Section
**Headline**: "Want Early Access?"
**Subheadline**: "Sponsor ZaneOps and get cloud access before everyone else"

**Benefits**:
- Free cloud access for 1 year
- Priority bug fixes and support
- Early access to new features
- Sponsor badge on profile
- Company logo on README ($100/month tier)

**Sponsor Tiers** (3-column grid):
- **$5/month**: Sponsor badge + early alpha access
- **$25/month**: Everything in $5 + priority bugs
- **$100/month**: Everything in $25 + logo placement + private support

**CTA**: "Become a Sponsor" � GitHub Sponsors

### 6. FAQ Section
1. "How is ZaneOps Cloud different from other PaaS?"
2. "When will cloud access be available?"
3. "What about self-hosted ZaneOps?"
4. "How does sponsorship work?"

### 7. Final CTA Section
Split layout with waitlist and sponsorship options side-by-side

## Implementation Status

###  Phase 1: Core Structure (COMPLETED)
1.  Copy global styles from LandingPage.astro to LandingPageCloud.astro
2.  Implement hero section with headline and CTAs
3.  Add value proposition 3-column grid
4.  Build feature showcase grid with all 9 features and lucide icons

###  Phase 2: Interactive Elements (COMPLETED)
5.  Create WaitlistForm.astro component
   - Form fields with validation
   - Client-side fetch to API
   - Loading/success/error states
6.  Enhance api/signup-cloud.ts
   - Add request validation
   - Implement form data handling
   - Return proper JSON responses
   - Add error handling

###  Phase 3: Conversion Elements (COMPLETED)
7.  Build sponsor section with tier cards
8.  Add FAQ section
9.  Implement final dual-CTA section
10.  Add smooth scroll navigation for CTAs

### = Phase 4: Polish & Refinement (TODO)
11. � Test responsive design on mobile/tablet
12. � Verify form submission flow
13. � Test accessibility (keyboard navigation, ARIA labels)
14. � Optimize images and performance
15. � Add real waitlist storage (Mailchimp, Airtable, etc.)

## Critical Files

### Files Modified
- `src/components/LandingPageCloud.astro` - Main landing page (434 lines)
- `src/pages/api/signup-cloud.ts` - API endpoint with validation

### Files Created
- `src/components/WaitlistForm.astro` - Signup form component

### Reference Files
- `src/components/LandingPage.astro` - Pattern reference
- `src/components/LogSectionHome.astro` - Interactive patterns
- `src/assets/global.css` - Theme colors

## Design System

### Colors
- Primary accent: `var(--sl-color-accent)`
- Border: `var(--color-border)`
- Background: `var(--color-bg)`
- Text: `var(--sl-color-text)`

### Typography
- H1: `text-4xl md:text-5xl lg:text-6xl`
- H2: `text-3xl md:text-4xl`
- H3: `text-xl md:text-2xl`

### Spacing
- Section gaps: `gap-60`
- Internal gaps: `gap-8` to `gap-12`
- Padding: `py-12 md:pt-24`

### Responsive
- Mobile: default
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

## Next Steps

### Immediate (Before Launch)
1. **Connect Waitlist Storage** - Integrate with email service
   - Options: Mailchimp, ConvertKit, Airtable, Google Sheets API
   - Update `src/pages/api/signup-cloud.ts` line 26-29

2. **Test on Real Devices**
   - Mobile: iOS Safari, Android Chrome
   - Tablet: iPad Safari
   - Desktop: Chrome, Firefox, Safari

3. **Accessibility Audit**
   - Test keyboard navigation
   - Verify screen reader support
   - Check color contrast ratios

### Future Enhancements (Post-Launch)
- Video demo of cloud features
- Comparison table (self-hosted vs cloud)
- Interactive feature demos (like LogSectionHome)
- Email drip campaign for waitlist subscribers
- Analytics tracking (conversion rates, form abandonment)

## Success Criteria
-  All 9 features displayed without pricing labels
-  Working signup form with validation
-  Clear sponsor CTAs with tier information
-  Mobile responsive design
-  Accessible (keyboard nav, ARIA labels)
-  Fast page load (<3s)
-  Waitlist connected to real storage


## TO-DO:
- [x] landing page
- [ ] setup resend (using SMTP), and use react-email for templating
- [ ] setup DB with drizzle & postgres
- [ ] when user signs up, tell them they need to validate their email
- [ ] send an email when the user signs up for validation
- [ ] After the user has clicked the link, they should be sent to a page that tell them it's confirmed (and it should update the row in the DB that the user has confirmed their email)
- [ ] Send the user another email to tell them that we will share the news about the waitlist 