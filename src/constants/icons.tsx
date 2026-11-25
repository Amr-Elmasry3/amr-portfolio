// Icon registry (lucide). Keys match the names used in the
// translation messages and data files.
// Note: lucide no longer ships brand icons, so github/linkedin
// will be added as inline SVGs with the sections that use them.
import {
	ArrowRight,
	CircleArrowRight,
	CodeXml,
	Download,
	FileCode,
	FolderCode,
	Globe,
	GraduationCap,
	Heart,
	Home,
	Mail,
	MapPin,
	MessageCircle,
	Moon,
	Send,
	Sun,
	User,
} from "lucide-react";

type Icons = {
	[key: string]: React.ReactNode;
};

export const icons: Icons = {
	home: <Home />,
	userCircle: <User />,
	codeAlt: <CodeXml />,
	folderCode: <FolderCode />,
	paperPlane: <Send />,
	envelope: <Mail />,
	envelopeFill: <Mail />,
	sun: <Sun />,
	moon: <Moon />,
	globe: <Globe />,
	download: <Download />,
	location: <MapPin />,
	whatsapp: <MessageCircle />,
	rightArrow: <ArrowRight />,
	rightArrowCircle: <CircleArrowRight />,
	graduationCap: <GraduationCap />,
	heartCode: <Heart />,
	fileCode: <FileCode />,
	folderCode2: <FolderCode />,
};
