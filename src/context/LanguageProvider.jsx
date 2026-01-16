import React, { useEffect, useState } from "react";
// 1. Імпортуємо наш спільний axiosInstance
import axiosInstance from "../api/axiosInstance"; 
import { LanguageContext } from "./LanguageContext";

export const LanguageProvider = ({ children }) => {
  const defaultLang = localStorage.getItem("language") || "ua";
  const [language, setLanguage] = useState(defaultLang);
  const [translations, setTranslations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTranslations = async () => {
      setLoading(true);
      try {
        // 2. Використовуємо axiosInstance. 
        // Тобі не треба писати весь шлях, тільки кінець: /translations/ua
        const res = await axiosInstance.get(`/translations/${language}`);
        
        if (isMounted) {
          setTranslations(res.data);
        }
      } catch (error) {
        console.error("Failed to load translations:", error);
        if (isMounted) {
          setTranslations(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    localStorage.setItem("language", language);
    fetchTranslations();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === "ua" ? "en" : "ua"));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        translations,
        loading,
        toggleLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};