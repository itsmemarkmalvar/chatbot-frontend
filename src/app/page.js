import { redirect } from 'next/navigation';
import Image from "next/image";
import styles from "./page.module.css";

export const metadata = {
  title: 'Chatbot',
  description: 'Welcome to the Chatbot application',
};

export default function Home() {
  // TODO: Add authentication check here
  // For now, redirect to login
  redirect('/login');
  
  return null;
}
