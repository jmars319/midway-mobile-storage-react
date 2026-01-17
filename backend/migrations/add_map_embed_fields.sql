-- Add Google Maps embed settings to site_settings
ALTER TABLE site_settings
    ADD COLUMN mapEmbedUrl TEXT AFTER siteUrl,
    ADD COLUMN mapEmbedEnabled TINYINT(1) NOT NULL DEFAULT 0 AFTER mapEmbedUrl;
