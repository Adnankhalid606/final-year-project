-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2026 at 02:05 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fyp`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `title`, `content`, `course_id`, `order`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Basic HTML ', 'This the Basic HTML', 1, 1, 2, '2026-05-05 13:30:48', '2026-05-05 13:30:48', NULL),
(2, 'Basic HTML Part 2', 'This the Basic HTML Part 2', 1, 2, 2, '2026-05-05 13:31:41', '2026-05-05 13:31:41', NULL),
(3, 'Basic HTML Part 3', 'This the Basic HTML Part 3', 1, 3, 2, '2026-05-05 13:31:58', '2026-05-05 13:31:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `bookmarks`
--

CREATE TABLE `bookmarks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `hackathon_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookmarks`
--

INSERT INTO `bookmarks` (`id`, `user_id`, `hackathon_id`, `created_at`) VALUES
(12, 4, 14, '2026-05-28 20:06:04');

-- --------------------------------------------------------

--
-- Table structure for table `cheatsheets`
--

CREATE TABLE `cheatsheets` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cheatsheets`
--

INSERT INTO `cheatsheets` (`id`, `title`, `slug`, `category`, `content`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'HTML Cheatsheet', 'html-cheatsheet', 'HTML', '<h1>HTML Basics</h1>', 2, '2026-05-05 13:42:31', '2026-05-05 13:42:31', NULL),
(2, 'CSS', 'css', 'CSS', '**Hello**', 3, '2026-05-29 10:18:44', '2026-05-29 10:18:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Web Dev Fundamentals', 'Learn HTML, CSS, JS from scratch', 2, '2026-05-05 13:28:00', '2026-05-05 13:28:00', NULL),
(2, 'TypeScript Essentials', 'Learn TypeScript from scratch — types, interfaces, generics, and integration with React.', 1, '2026-05-26 20:28:29', '2026-05-26 20:28:29', NULL),
(3, 'Git & GitHub for Beginners', 'Master version control with Git. Learn branching, merging, pull requests, and collaboration.', 1, '2026-05-26 20:28:29', '2026-05-26 20:28:29', NULL),
(4, 'REST API Design', 'Design and build RESTful APIs. Learn HTTP methods, status codes, authentication, and best practices.', 1, '2026-05-26 20:28:29', '2026-05-26 20:28:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `hackathons`
--

CREATE TABLE `hackathons` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('upcoming','active','completed') DEFAULT 'upcoming',
  `organizer_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `registration_link` varchar(500) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hackathons`
--

INSERT INTO `hackathons` (`id`, `title`, `description`, `banner`, `start_date`, `end_date`, `status`, `organizer_id`, `created_at`, `updated_at`, `registration_link`, `deleted_at`) VALUES
(8, 'Hack on vibe', 'HackOnVibe is a 3-day online hackathon for vibe coders, AI builders, indie makers, and first-time founders who want to finally build the application they have been postponing.\n\nThe main challenge is to create an AI-assisted everyday tool that can be useful for individuals, small teams, or small and medium-sized businesses. Your product should solve a real recurring problem: saving time, automating routine work, improving communication, helping with decisions, managing content, serving customers, or making daily workflows easier.\n\nThis hackathon is not only about building a prototype. Each team should present the full product vision: core functionality, user flow, AI-powered features, integrations, target audience, business model, pricing, first users, and potential path to market.\n\nHackOnVibe is a place to ship your first application, test the idea with the community, receive early validation, and find your first supporters or potential customers.\n\n', 'https://cdn.dorahacks.io/static/files/19e54552393aca29731024c4e6ca7a1f.png', '2026-06-03 00:00:00', '2026-06-05 00:00:00', 'upcoming', 3, '2026-05-26 14:20:30', '2026-05-26 20:34:01', 'https://dev.events/conferences/bli-legal-tech-hackathon-2-4sj-hmdd', NULL),
(9, 'The Legal Tech Hackathon Invites You To Build!', 'Join our second year of the Blockchain Legal Institute\'s global legal hackathon and win bounties and support from blockchain companies along with leading law firms.\nOver $50,000+ USD in bounties and support from top blockchain law firms!\nAccess to mentors and legal professionals to help you succeed.\nA global network of tech accelerators and incubators to grow your business.', 'https://cdn.dorahacks.io/static/files/19ba9cb47c0de3c85ee002a49f5a2762.jpg', '2026-05-14 00:00:00', '2026-10-31 00:00:00', 'upcoming', 3, '2026-05-26 14:22:38', '2026-05-26 14:33:05', 'https://dev.events/conferences/bli-legal-tech-hackathon-2-4sj-hmdd', NULL),
(10, 'Health Tech Hackathon', 'Build digital health solutions — telemedicine, fitness tracking, or mental health apps.', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', '2026-09-10 09:00:00', '2026-09-12 18:00:00', 'upcoming', 4, '2026-05-26 20:28:46', '2026-05-26 20:28:46', 'https://devpost.com', NULL),
(11, 'Game Dev Jam 2026', '48-hour game development jam. Build a game from scratch using any engine or framework.', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', '2026-09-20 10:00:00', '2026-09-22 10:00:00', 'upcoming', 5, '2026-05-26 20:28:46', '2026-05-26 20:28:46', 'https://itch.io', NULL),
(12, 'Blockchain Buildathon', 'Build decentralized apps on any blockchain. Focus on real-world utility, not speculation.', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800', '2026-10-01 09:00:00', '2026-10-03 18:00:00', 'upcoming', 4, '2026-05-26 20:28:46', '2026-05-26 20:28:46', 'https://devpost.com', NULL),
(13, 'Hackathon 2026 Challenge', 'Phase 1: Preparation & Onboarding\nMarch 1 – May 31, 2026\n\nDoraHacks Onboarding: Registration opens on DoraHacks.io. Participants can set up their profiles and find teammates.\nEducational Series: Weekly webinars covering the three tracks (Electricity, Traffic, and Pollution) with guest experts from Ghana’s infrastructure and environmental sectors.\nIdeation Workshops: \"Office Hours\" to help teams refine their project concepts before the code starts flowing.\nPhase 2: Hacking & Mentorship\n1st June – October 31, 2026\n\nThe Build Begins: Official start of the hacking period.\nTechnical Mentorship: Weekly check-ins with developers and mentors to troubleshoot and optimize solutions.\nSubmission Deadline: All projects, including the pre-recorded demo video and GitHub repository, must be submitted via DoraHacks by October 31, 11:59 PM GMT.\nPhase 3: Judging & Winners Announcement\nNovember 1 – December 18, 2026\n\nReview Period: Judges evaluate submissions based on technical execution, innovation, and scalability for the Ghanaian market.\nThe Pitch Finale: The top 3 finalists will be invited to a in person demo day to pitch their solutions live at Tech Guru Meetup 2026.\nAwards Ceremony: Winners of the $1,000 prize pool are announced on October 31st.\n🏆Prizes $1000\nThe prize pool is designed to reward the most impactful solutions across our three core pillars. By participating, you are competing for a share of $1,000 in cash prizes, distributed to the top three standout projects that demonstrate the highest potential for real-world impact in Ghana.\n\nTotal Prize Pool: $1,000\nWhile you choose one specific track to build in, all projects are judged together to determine the ultimate winners of the 2026 Challenge.\n\n🥇 1st Place $450 : The top-rated project across all tracks with the highest technical and social impact.\n🥈 2nd Place $300 : The runner-up project demonstrating exceptional innovation and feasibility.\n🥉 3rd Place $250 : The third-place project with a strong, scalable solution for its chosen challenge.\nTrack-Specific Recognition\nIn addition to the cash prizes, the top project from each individual track will receive:\n\nOfficial Tech Hub Africa Certification: A digital badge and certificate for your portfolio.\nEcosystem Exposure: Features on our social media platforms and website to showcase your work to potential investors and partners.\nMentorship Opportunities: Direct access to industry experts to help refine your project post-hackathon.\nNote: To ensure a fair competition, prizes are awarded based on the judging criteria including Innovation, Technical Execution, and Scalability. Whether you are an individual or a team, the prize amount remains the same per placing.\n\n🌍Eligibility:\nDevelopers\nStudents\nStartups\nInnovators across Africa and the world!', 'https://cdn.dorahacks.io/static/files/19c7b0f2b4ac692ac96521e479c87260.jpg', '2026-05-22 00:00:00', '2026-08-20 00:00:00', 'upcoming', 3, '2026-05-26 20:38:38', '2026-05-26 20:38:38', 'https://dev.events/conferences/bli-legal-tech-hackathon-2-4sj-hmdd', NULL),
(14, 'From Prompt to Product: The Syntra Hackathon', 'Welcome to the Syntra Launch Build Challenge.\n\nTo celebrate the launch of Syntra, we’re inviting developers, founders, makers, and builders to create and submit projects built with Syntra for a chance to win exclusive rewards and be featured by the Syntra team.\n\nThis hackathon is about turning ideas into real products faster. Whether you’re building a SaaS product, AI app, workflow automation, internal tool, or something entirely new, we want to see what you can build with Syntra.\n\nEvery valid submission must clearly show Syntra in use during the build process and include a working demo of the final project.', 'https://cdn.dorahacks.io/static/files/19d1332fb963c0f14d6ad40454aa42cb.png', '2026-03-24 00:00:00', '2026-05-19 00:00:00', 'completed', 3, '2026-05-26 20:43:52', '2026-05-26 20:52:10', 'https://dorahacks.io/hackathon/syntra/detail', NULL),
(15, 'add', 'asdad', 'https://cdn.dorahacks.io/static/files/19e54552393aca29731024c4e6ca7a1f.png', '5545-04-05 00:00:00', '6666-05-06 00:00:00', 'upcoming', 6, '2026-05-28 20:08:40', '2026-05-28 20:08:40', 'https://dev.events/conferences/bli-legal-tech-hackathon-2-4sj-hmdd', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `progress`
--

CREATE TABLE `progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `article_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `progress`
--

INSERT INTO `progress` (`id`, `user_id`, `article_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 2, 1, '2026-05-05 13:40:11', '2026-05-05 13:40:11', NULL),
(2, 3, 1, '2026-05-17 15:22:19', '2026-05-17 15:22:19', NULL),
(4, 3, 2, '2026-05-29 10:12:04', '2026-05-29 10:12:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('user','organizer','admin') DEFAULT 'user',
  `account_status` enum('pending','approved','rejected') DEFAULT 'approved',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `account_status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Zain', 'zain@test.com', '$2b$10$vVfntePQVhpZrnvPT.PzXev1Wisy9FWHAhr6GpN6evd7ZIWm432pi', 'user', 'approved', '2026-05-05 13:11:26', '2026-05-26 14:25:58', '2026-05-26 14:25:58'),
(2, 'Adnan', 'adnan@test.com', '$2b$10$ePAoL4ETxdXZwN6TXJVx/OIvBNMGgWphJX31OZyt7zB.N44vUdCPi', 'admin', 'approved', '2026-05-05 13:12:00', '2026-05-05 13:26:20', NULL),
(3, 'Mehtab Khan', 'mehtabbb@gmail.com', '$2b$10$iy.4qYwRk/.RE8NGb7SYTuq6wh9XpVw9QyRsxPLgm19hWTW6gK7Gi', 'admin', 'approved', '2026-05-17 12:49:25', '2026-05-17 15:05:35', NULL),
(4, 'Mehtab Khan', 'mehtab.user@gmail.com', '$2b$10$M3I0MIF8bKh5TFiprfjuneUvAIdM3/LY1P8xkUFBRJggeV1zx4CL.', 'user', 'approved', '2026-05-17 15:26:13', '2026-05-17 15:26:13', NULL),
(5, 'Mehtab Khan', 'mehtab4050@gmail.com', '$2b$10$6z5Is0MqS8a.JkyJMRsyhOiDI83XE7kvlnFzoD1DNE3AEGRO5xhJm', 'user', 'approved', '2026-05-26 12:35:11', '2026-05-29 10:17:54', '2026-05-29 10:17:54'),
(6, 'mehtab-org', 'mehtab.organizer@gmail.com', '$2b$10$hYoi4hdmQYmjHFn0q1Co.e.9/JiNE2007X9oOnEfwdVgV7ZNCbve6', 'organizer', 'approved', '2026-05-28 20:06:43', '2026-05-28 20:07:16', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `hackathon_id` (`hackathon_id`);

--
-- Indexes for table `cheatsheets`
--
ALTER TABLE `cheatsheets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

ALTER TABLE `hackathons`
  ADD COLUMN `prize_pool` DECIMAL(12,2) DEFAULT NULL AFTER `registration_link`;

--
-- Indexes for table `progress`
--
ALTER TABLE `progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`article_id`),
  ADD KEY `article_id` (`article_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `cheatsheets`
--
ALTER TABLE `cheatsheets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `hackathons`
--
ALTER TABLE `hackathons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `progress`
--
ALTER TABLE `progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`);

--
-- Constraints for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD CONSTRAINT `bookmarks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookmarks_ibfk_2` FOREIGN KEY (`hackathon_id`) REFERENCES `hackathons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `hackathons`
--
ALTER TABLE `hackathons`
  ADD CONSTRAINT `hackathons_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `progress`
--
ALTER TABLE `progress`
  ADD CONSTRAINT `progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `progress_ibfk_2` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
