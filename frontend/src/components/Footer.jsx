import React from "react";
import { footerStyles } from "../assets/dummyStyles";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiLink } from "react-icons/fi";

FaFacebook;

const Footer = () => {
  const socialLinks = [
    {
      icon: FaFacebook,
      url: "https://www.facebook.com/",
    },
    {
      icon: FaTwitter,
      url: "https://twitter.com/",
    },
    {
      icon: FaInstagram,
      url: "https://www.instagram.com/",
    },
    {
      icon: FaYoutube,
      url: "https://www.youtube.com/",
    },
  ];

  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.topBorder} />

      {/* Floating shapes */}
      <div
        className={`${footerStyles.floatingShape} -top-24 -right-24 w-80 h-80 opacity-20`}
      ></div>
      <div
        className={`${footerStyles.floatingShape} -bottom-40 -left-24 w-96 h-96 opacity-15 animation-delay-2000`}
      ></div>
      <div
        className={`${footerStyles.floatingShape} top-1/4 left-1/3 w-64 h-64 bg-emerald-600 opacity-10 animate-pulse animation-delay-1000`}
      ></div>

      <div className={footerStyles.container}>
        <div className={footerStyles.grid}>
          {/* Brand */}
          <div>
            <h2 className={footerStyles.brandTitle}>
              Grocery<span className={footerStyles.brandSpan}>Store</span>
            </h2>
            <p className={footerStyles.brandText}>
              Bringing you the freshest organic product since 2020. Our mission
              is to deliver farm-fresh goodness to your doorsteps.
            </p>

            {/* Social Links */}
            <div className="space-x-3 flex">
              {socialLinks.map((social, idx) => (
                <a
                  href={social.url}
                  key={idx}
                  target="_blank"
                  aria-label={`Visit our ${social.icon.name.replace(
                    "Fa",
                    ""
                  )} page`}
                  className={footerStyles.socialLink}
                >
                  <social.icon
                    className={footerStyles.socialIcon}
                  ></social.icon>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={footerStyles.sectionTitle}>
              <FiLink className={footerStyles.sectionIcon} />
              Quick Links
            </h3>
            <ul className={footerStyles.linkList}>
              {["Home", "Items", "Contact"].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className={footerStyles.linkItem}
                  >
                    <span className={footerStyles.linkBullet}>
                     
                    </span>
                     {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
