import { PostStatus, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const authorId = 'cm95vk67200025ckydzcd5bog'; // The provided user ID}



    const techCategory = await prisma.category.create({
        data: {
            name: 'Technology',
            slug: 'technology',
            description: 'All about the latest tech trends and innovations',
            image: 'https://picsum.photos/seed/techcategory/800/400'
        }
    });

    const aiCategory = await prisma.category.create({
        data: {
            name: 'Artificial Intelligence',
            slug: 'ai',
            description: 'Exploring the world of AI and machine learning',
            image: 'https://picsum.photos/seed/aicategory/800/400'
        }
    });


    const tags = await Promise.all([
        prisma.tag.create({ data: { name: 'Machine Learning', slug: 'machine-learning' } }),
        prisma.tag.create({ data: { name: 'Web Development', slug: 'web-development' } }),
        prisma.tag.create({ data: { name: 'Cloud Computing', slug: 'cloud-computing' } }),
        prisma.tag.create({ data: { name: 'JavaScript', slug: 'javascript' } }),
        prisma.tag.create({ data: { name: 'Mobile Apps', slug: 'mobile-apps' } }),
        prisma.tag.create({ data: { name: 'Cybersecurity', slug: 'cybersecurity' } }),
        prisma.tag.create({ data: { name: 'Programming', slug: 'programming' } }),
        prisma.tag.create({ data: { name: 'React', slug: 'react' } })
    ]);


    const webDevCategory = await prisma.category.create({
        data: {
            name: 'Web Development',
            slug: 'web-dev',
            description: 'Modern web development technologies and best practices',
            image: 'https://picsum.photos/seed/webdevcategory/800/400'
        }
    });

    const cybersecurityCategory = await prisma.category.create({
        data: {
            name: 'Cybersecurity',
            slug: 'cybersecurity',
            description: 'Security concepts, vulnerabilities, and protection strategies',
            image: 'https://picsum.photos/seed/securitycategory/800/400'
        }
    });

    const cloudCategory = await prisma.category.create({
        data: {
            name: 'Cloud Computing',
            slug: 'cloud',
            description: 'Cloud platforms, architecture, and deployment strategies',
            image: 'https://picsum.photos/seed/cloudcategory/800/400'
        }
    });


    const additionalTags = await Promise.all([
        prisma.tag.create({ data: { name: 'DevOps', slug: 'devops' } }),
        prisma.tag.create({ data: { name: 'Docker', slug: 'docker' } }),
        prisma.tag.create({ data: { name: 'Kubernetes', slug: 'kubernetes' } }),
        prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript' } }),
        prisma.tag.create({ data: { name: 'Next.js', slug: 'nextjs' } }),
        prisma.tag.create({ data: { name: 'AWS', slug: 'aws' } }),
        prisma.tag.create({ data: { name: 'Blockchain', slug: 'blockchain' } }),
        prisma.tag.create({ data: { name: 'Security', slug: 'security' } })
    ]);


    const allTags = [...tags, ...additionalTags];

    const posts = [
        {
            title: 'The Future of AI in Web Development',
            slug: 'future-of-ai-in-web-development',
            content: JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Real-time collaborative editors like Google Docs have transformed how we work together on documents, code, and creative projects. Building such functionality might seem complex, but with WebSockets and the right approach, you can add real-time collaboration to your own web applications.'
                            }
                        ]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'This tutorial will guide you through creating a basic collaborative text editor using WebSockets for real-time communication.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Understanding the Architecture' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'A real-time collaborative editor consists of several key components:'
                            }
                        ]
                    },
                    {
                        type: 'bulletList',
                        content: [
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'A text editor interface on the client side'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'WebSocket connections for bidirectional communication'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'A conflict resolution algorithm (Operational Transformation or CRDT)'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Persistence layer to save document state'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Setting Up WebSockets' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'WebSockets provide a persistent connection between clients and the server, allowing for real-time data exchange. For our collaborative editor, we\'ll use Socket.IO, a library that simplifies WebSocket implementation with fallbacks for older browsers.'
                            }
                        ]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'On the server side, you\'ll need to set up a Socket.IO server that handles connections and broadcasts changes to all connected clients.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Choosing a Conflict Resolution Strategy' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'When multiple users edit a document simultaneously, conflicts are inevitable. There are two main approaches to handling these conflicts:'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 3 },
                        content: [{ type: 'text', text: 'Operational Transformation (OT)' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'OT transforms operations so they can be applied in any order while preserving intent. Google Docs uses this approach. Libraries like ShareDB implement OT for JavaScript applications.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 3 },
                        content: [{ type: 'text', text: 'Conflict-free Replicated Data Types (CRDTs)' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'CRDTs are data structures that can be replicated across multiple computers and merged without conflicts. Libraries like Yjs and Automerge implement CRDTs for collaborative editing.'
                            }
                        ]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'For simplicity in this tutorial, we\'ll use Yjs, which provides a relatively straightforward API for collaborative editing.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Building the Editor Interface' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'For the editor interface, we can use one of several rich text editors that integrate well with collaborative editing libraries:'
                            }
                        ]
                    },
                    {
                        type: 'bulletList',
                        content: [
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Monaco Editor (powers VS Code) for code editing'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'ProseMirror or TipTap for rich text editing'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'CodeMirror for simpler code editing'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'We\'ll use ProseMirror with a Yjs binding for our collaborative editor.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Implementing User Presence' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'A collaborative editor should show which users are currently viewing the document and where their cursors are positioned. This creates a sense of presence and helps prevent editing conflicts.'
                            }
                        ]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'We can implement this by:'
                            }
                        ]
                    },
                    {
                        type: 'bulletList',
                        content: [
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Tracking cursor position and selection changes'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Broadcasting these changes via WebSockets'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Rendering other users\' cursors with identifying colors or labels'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Persistence and Recovery' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'To ensure that document changes are not lost, we need to persist the document state. This can be done by:'
                            }
                        ]
                    },
                    {
                        type: 'bulletList',
                        content: [
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Saving the document state to a database periodically'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Recording a change history for undo/redo functionality'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Implementing recovery mechanisms for clients that disconnect and reconnect'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Security Considerations' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'When building a collaborative editor, security is crucial. Consider implementing:'
                            }
                        ]
                    },
                    {
                        type: 'bulletList',
                        content: [
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Authentication to control who can edit documents'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Authorization to define read/write permissions'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Input validation to prevent XSS and other injection attacks'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Rate limiting to prevent DoS attacks'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Conclusion' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Building a real-time collaborative editor is a complex but rewarding project. By leveraging WebSockets, modern conflict resolution algorithms, and robust editor components, you can create a collaborative experience that enhances productivity and encourages teamwork.'
                            }
                        ]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'As your editor evolves, consider adding features like comments, suggestions, and version history to create an even more powerful collaborative environment.'
                            }
                        ]
                    }
                ]
            }),
            shortDesc: 'A step-by-step guide to building a real-time collaborative text editor using WebSockets and modern JavaScript libraries.',
            mainImage: 'https://picsum.photos/seed/realtimeeditor/1200/630',
            featured: false,
            published: true,
            status: PostStatus.PUBLISHED,
            readingTime: 11,
            authorId,
            categoryId: techCategory.id,
            tagIds: [tags[1].id, tags[3].id, tags[6].id],
            publishedAt: new Date('2024-03-10T11:20:00Z')
        },
        {
            title: 'TypeScript: Why Every JavaScript Developer Should Make the Switch',
            slug: 'typescript-why-make-the-switch',
            content: JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'As web applications become increasingly complex, the limitations of JavaScript as a dynamically typed language become more apparent. This is where TypeScript shines, offering type safety while preserving the flexibility that JavaScript developers love.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'What is TypeScript?' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'TypeScript is a strongly typed programming language that builds on JavaScript. It adds static type definitions, making it easier to catch errors early in the development process.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Key Benefits' }]
                    },
                    {
                        type: 'bulletList',
                        content: [
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Better tooling support with intelligent code completion' }]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Fewer bugs due to compile-time error checking' }]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Improved code maintainability and readability' }]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Seamless integration with existing JavaScript code' }]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Getting Started with TypeScript' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'TypeScript can be integrated into your existing JavaScript projects incrementally, allowing you to convert files one at a time. This makes the adoption process much smoother than completely rewriting your code.'
                            }
                        ]
                    }
                ]
            }),
            shortDesc: 'Discover why TypeScript has become essential for modern web development and how it can improve your JavaScript projects.',
            mainImage: 'https://picsum.photos/seed/typescript/1200/630',
            featured: true,
            published: true,
            status: PostStatus.PUBLISHED,
            readingTime: 5,
            authorId,
            categoryId: webDevCategory.id,
            tagIds: [allTags[3].id, allTags[11].id, allTags[6].id],
            publishedAt: new Date('2024-02-15T09:30:00Z')
        },
        {
            title: 'Zero-Trust Security: Protecting Your Cloud Infrastructure',
            slug: 'zero-trust-security-cloud-infrastructure',
            content: JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'With organizations rapidly moving to cloud-based infrastructure, traditional security perimeters are disappearing. Zero-trust security has emerged as a crucial approach for protecting modern cloud deployments.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'What is Zero-Trust Security?' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Zero-trust security operates on the principle of "never trust, always verify." Every request is authenticated and authorized regardless of where it originates from, eliminating the concept of trusted internal networks.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Implementing Zero-Trust in Cloud Environments' }]
                    },
                    {
                        type: 'bulletList',
                        content: [
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Identity and access management (IAM)' }]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Micro-segmentation of network resources' }]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Continuous monitoring and verification' }]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }),
            shortDesc: 'Learn how to implement zero-trust security principles to protect your cloud-based infrastructure from evolving threats.',
            mainImage: 'https://picsum.photos/seed/zerotrust/1200/630',
            featured: false,
            published: true,
            status: PostStatus.PUBLISHED,
            readingTime: 7,
            authorId,
            categoryId: cybersecurityCategory.id,
            tagIds: [allTags[5].id, allTags[15].id, allTags[13].id],
            publishedAt: new Date('2024-03-05T14:45:00Z')
        },
        {
            title: 'Containerization with Docker: A Beginner\'s Guide',
            slug: 'containerization-docker-beginners-guide',
            content: JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Docker has revolutionized application deployment by making containerization accessible to developers. This guide will help you understand the basics of Docker and get started with containerizing your applications.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Understanding Containers' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Containers package an application and its dependencies together, ensuring consistent behavior across different environments. Unlike virtual machines, containers share the host OS kernel, making them lightweight and fast to start.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Key Docker Concepts' }]
                    },
                    {
                        type: 'bulletList',
                        content: [
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Docker images: Blueprints for containers' }]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Dockerfile: Instructions for building images' }]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Docker volumes: Persistent data storage' }]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }),
            shortDesc: 'A beginner-friendly introduction to Docker containers and how they simplify application deployment and management.',
            mainImage: 'https://picsum.photos/seed/docker/1200/630',
            featured: true,
            published: true,
            status: PostStatus.PUBLISHED,
            readingTime: 6,
            authorId,
            categoryId: cloudCategory.id,
            tagIds: [allTags[8].id, allTags[9].id, allTags[10].id],
            publishedAt: new Date('2024-02-28T10:15:00Z')
        },
        {
            title: 'Building Modern UIs with React and TypeScript',
            slug: 'building-modern-uis-react-typescript',
            content: JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Combining React with TypeScript creates a powerful development experience for building robust user interfaces. This article explores best practices for leveraging TypeScript in React projects.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Type-Safe Components' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'TypeScript enables you to define precise prop types for your React components, reducing runtime errors and improving developer experience with better autocompletion and documentation.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'State Management with TypeScript' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Whether using React\'s built-in hooks or external libraries like Redux, TypeScript provides type safety for your application state, making complex state management more maintainable.'
                            }
                        ]
                    }
                ]
            }),
            shortDesc: 'Learn how to leverage TypeScript in React applications to create robust, maintainable user interfaces with improved developer experience.',
            mainImage: 'https://picsum.photos/seed/reactts/1200/630',
            featured: false,
            published: true,
            status: PostStatus.PUBLISHED,
            readingTime: 8,
            authorId,
            categoryId: webDevCategory.id,
            tagIds: [allTags[7].id, allTags[11].id, allTags[3].id],
            publishedAt: new Date('2024-03-18T08:45:00Z')
        },
        {
            title: 'Serverless Architecture: The Future of Backend Development',
            slug: 'serverless-architecture-future-backend',
            content: JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Serverless computing is transforming backend development by allowing developers to build and run applications without thinking about servers. This article explores the benefits and challenges of serverless architecture.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'What is Serverless?' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Contrary to its name, serverless doesn\'t mean there are no servers. It means developers don\'t need to provision or manage servers. The cloud provider takes care of infrastructure management, and you only pay for the resources you actually use.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Key Benefits' }]
                    },
                    {
                        type: 'bulletList',
                        content: [
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Reduced operational costs' }]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Automatic scaling' }]
                                    }
                                ]
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Faster time to market' }]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }),
            shortDesc: 'Explore how serverless architecture is changing backend development and why it might be the right choice for your next project.',
            mainImage: 'https://picsum.photos/seed/serverless/1200/630',
            featured: false,
            published: true,
            status: PostStatus.PUBLISHED,
            readingTime: 7,
            authorId,
            categoryId: cloudCategory.id,
            tagIds: [allTags[13].id, allTags[8].id, allTags[2].id],
            publishedAt: new Date('2024-02-20T11:00:00Z')
        },
        {
            title: 'Machine Learning for Web Developers',
            slug: 'machine-learning-web-developers',
            content: JSON.stringify({
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'Machine learning is becoming increasingly accessible to web developers. This article explores practical ways to integrate ML capabilities into web applications using JavaScript libraries like TensorFlow.js.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Client-Side Machine Learning' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'With TensorFlow.js, you can run machine learning models directly in the browser, enabling real-time predictions without server roundtrips. This opens up possibilities for interactive experiences like image recognition, natural language processing, and more.'
                            }
                        ]
                    },
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Getting Started with TensorFlow.js' }]
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'TensorFlow.js allows you to use pre-trained models or train custom models directly in JavaScript. Here\'s a simple example of using a pre-trained model for image classification in a web app.'
                            }
                        ]
                    }
                ]
            }),
            shortDesc: 'Learn how web developers can leverage machine learning capabilities using JavaScript and TensorFlow.js to create smarter web applications.',
            mainImage: 'https://picsum.photos/seed/mlweb/1200/630',
            featured: true,
            published: true,
            status: PostStatus.PUBLISHED,
            readingTime: 9,
            authorId,
            categoryId: aiCategory.id,
            tagIds: [allTags[0].id, allTags[3].id, allTags[1].id],
            publishedAt: new Date('2024-03-25T13:30:00Z')
        }
    ];


    for (const postData of posts) {
        const { tagIds, ...postInfo } = postData;


        const post = await prisma.post.create({
            data: {
                ...postInfo,
                tags: {
                    create: tagIds.map(tagId => ({
                        tag: {
                            connect: { id: tagId }
                        }
                    }))
                },
                seo: {
                    create: {
                        metaTitle: postInfo.title,
                        metaDesc: postInfo.shortDesc,
                        ogTitle: postInfo.title,
                        ogDesc: postInfo.shortDesc,
                        ogImage: postInfo.mainImage,
                        keywords: tagIds.map(id => tags.find(tag => tag.id === id)?.name).filter(Boolean).join(', ')
                    }
                }
            }
        });



        const viewCount = Math.floor(Math.random() * 150) + 50;
        const likeCount = Math.floor(Math.random() * 30) + 5;

   
        const views = [];
        for (let i = 0; i < viewCount; i++) {
            views.push({
                postId: post.id,
                ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
                userAgent: 'Mozilla/5.0',
                duration: Math.floor(Math.random() * 300) + 60
            });
        }
        await prisma.postView.createMany({ data: views });

        const likes = [];
        for (let i = 0; i < likeCount; i++) {
          
            likes.push({
                postId: post.id,
                userId: authorId,
            });
        }

        try {
         
            await prisma.postLike.create({
                data: {
                    postId: post.id,
                    userId: authorId
                }
            });
        } catch  {
            console.log('User already liked this post');
        }

        const commentCount = Math.floor(Math.random() * 5) + 1;
        const commentTexts = [
            "Great article! Very informative.",
            "Thanks for sharing these insights.",
            "I've been looking for information on this topic. Very helpful!",
            "Have you considered exploring [related topic] in a future post?",
            "This answered all my questions. Looking forward to more content like this.",
            "I disagree with some points, but overall a good read.",
            "The examples you provided really helped clarify the concepts.",
            "Could you elaborate more on the section about [specific topic]?",
            "I implemented your suggestions and saw immediate improvements.",
            "Sharing this with my team right now!"
        ];
        const comments = [];
        for (let i = 0; i < commentCount; i++) {
            comments.push({
                authorId: authorId, 
                postId: post.id,
                content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
                createdAt: new Date()
            });
        }

        await prisma.comment.createMany({ data: comments });


        await prisma.post.update({
            where: { id: post.id },
            data: {
                shareCount: Math.floor(Math.random() * 10) + 1,
                viewCount: viewCount,
                likeCount: likeCount > 1 ? likeCount : 1
            }
        });
    }

    console.log('Seed completed successfully!');
}


main()
    .catch((e) => {
        console.error('Error while seeding the database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
