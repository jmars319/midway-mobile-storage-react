-- Migration: Add About section fields to site_settings table
-- Run this on your production database to add About section customization

ALTER TABLE site_settings 
ADD COLUMN aboutTitle VARCHAR(255) NOT NULL DEFAULT 'About Midway Mobile Storage' AFTER siteUrl,
ADD COLUMN aboutSubtitle VARCHAR(255) NOT NULL DEFAULT 'Serving Winston-Salem and the Triad Area' AFTER aboutTitle,
ADD COLUMN aboutSinceYear VARCHAR(10) NOT NULL DEFAULT '1989' AFTER aboutSubtitle,
ADD COLUMN aboutText1 TEXT AFTER aboutSinceYear,
ADD COLUMN aboutText2 TEXT AFTER aboutText1,
ADD COLUMN aboutCommitments TEXT AFTER aboutText2;

-- Set default values for existing row (if exists)
UPDATE site_settings 
SET 
    aboutTitle = 'About Midway Mobile Storage',
    aboutSubtitle = 'Serving Winston-Salem and the Triad Area',
    aboutSinceYear = '1989',
    aboutText1 = 'Since 1989, Midway Mobile Storage has been at the forefront of the portable storage industry in Winston-Salem, NC. With over three decades of experience, we\'ve built our reputation on delivering secure, affordable mobile storage solutions backed by unmatched expertise and customer service throughout North Carolina.',
    aboutText2 = 'As pioneers in our market, we understand what our customers need — whether it\'s short-term job site storage, long-term container rentals, or premium waterproofing products like PanelSeal. Our commitment to quality and innovation has made us a trusted partner for businesses and individuals throughout Winston-Salem, Greensboro, High Point, and surrounding areas.',
    aboutCommitments = 'Quality Products,Professional Service,Flexible Solutions,Competitive Pricing'
WHERE aboutText1 IS NULL OR aboutText1 = '';
