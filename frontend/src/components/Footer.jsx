import React from "react";
import { footerStyles } from "../assets/dummyStyles";
import {
  FaApplePay,
  FaCcAmex,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMapMarkedAlt,
  FaPhone,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { FiBookmark, FiLink, FiMail } from "react-icons/fi";
import { BsTelephone } from "react-icons/bs";
import {BiMailSend} from "react-icons/bi";

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
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className={footerStyles.linkItem}
                  >
                    <span className={footerStyles.linkBullet}></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={footerStyles.sectionTitle}>
              <BsTelephone className={footerStyles.sectionIcon} />
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm sm:text-base">
              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <FaMapMarkedAlt className={footerStyles.contactIcon} />
                </div>

                <div>
                  <p>22 Connaught Place, New Delhi, Delhi 110001, India</p>

                  {/* Embedded Google Map */}
                  <iframe
                    title="Map Location - FreshCart Delhi"
                    width="100%"
                    height="200"
                    loading="lazy"
                    allowFullScreen
                    className="rounded-lg mt-3"
                    src="https://www.google.com/maps?q=Connaught+Place,+New+Delhi,+Delhi+110001,+India&output=embed"
                  ></iframe>
                </div>
              </li>

              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <FaPhone className={footerStyles.contactIcon} />
                </div>
                <div>
                  <p>+918584388489</p>
                </div>
              </li>

              <li className={footerStyles.contactItem}>
                <div className={footerStyles.contactIconContainer}>
                  <FaEnvelope className={footerStyles.contactIcon} />
                </div>
                <div>
                  <p>subh.say99@gmail.com</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}

          <div>
             <h3 className={footerStyles.sectionTitle}>
              <FiMail className={footerStyles.sectionIcon}/>NewsLetter
             </h3>
             <p className={footerStyles.newsletterText}>
              Subscribe to our newsletter for fresh updates, exclusive offers,
              and seasonal recipes!
             </p>
             
             <div className={footerStyles.newsletterForm}>
              <input type="email" placeholder="Enter Email Address" className={footerStyles.newsletterButton}/>
              <button className={footerStyles.newsletterButton}>
                <BiMailSend className="mr-2 text-lg"/>
                <span>Subscribe</span>
              </button>
             </div>

             <p className={footerStyles.privacyText}>
              We respect your privacy. Unsubscribe at any time.
             </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className={footerStyles.paymentSection}>
            <h4 className={footerStyles.paymentTitle}>
              <FiBookmark className={footerStyles.paymentIcon}/> We Accept All Major payment
            </h4>

            <div className={footerStyles.paymentMethods}>
              {[FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex, FaApplePay].map((Icon,idx)=>(
                <div key={idx} className={footerStyles.paymentItem}>
                  <Icon className={footerStyles.paymentIcon}/>
                </div>
              ))}

            </div>
        </div>

        {/* HR */}
        <div className={footerStyles.attribution}>
          <div className={footerStyles.attributionBadge}>
            <div className={footerStyles.hexagonContainer}>
                
                <div className={footerStyles.hexagon}></div>

                <div className={footerStyles.hexagonInner}>
                  <div className={footerStyles.hexagonInnerShape}></div>
                </div>
            </div>

            <span className={footerStyles.attributionText}>
             Designed By {' '}
             <a href="https://github.com/SubhashSonu" className={footerStyles.attributionLink} target='_blank'>
             Subhash Sonu
             </a>
             </span>
          </div>

        </div>
      </div>
      <style>
           {footerStyles.customCSS}
      </style>
    </footer>
  );
};

export default Footer;
