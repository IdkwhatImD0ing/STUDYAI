import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { Event, getAllLocalStorageItems, getRefValue, getRefValues, isTrue, preventDefault, refs, spreadArraysOrObjects, uploadFiles, useEventLoop } from "/utils/state"
import { ColorModeContext, EventLoopContext, initialEvents, StateContext } from "/utils/context.js"
import "focus-visible/dist/focus-visible"
import "katex/dist/katex.min.css"
import { Box, Center, Code, Heading, HStack, Image, Link, ListItem, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, OrderedList, Spacer, Text, UnorderedList, VStack } from "@chakra-ui/react"
import { getEventURL } from "/utils/state.js"
import NextLink from "next/link"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import { Prism } from "react-syntax-highlighter"
import { light } from "/styles/code/prism"
import { HamburgerIcon } from "@chakra-ui/icons"
import NextHead from "next/head"



export default function Component() {
  const state = useContext(StateContext)
  const router = useRouter()
  const [ colorMode, toggleColorMode ] = useContext(ColorModeContext)
  const focusRef = useRef();
  
  // Main event loop.
  const [addEvents, connectError] = useContext(EventLoopContext)

  // Set focus to the specified element.
  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  })

  // Route after the initial page hydration.
  useEffect(() => {
    const change_complete = () => addEvents(initialEvents())
    router.events.on('routeChangeComplete', change_complete)
    return () => {
      router.events.off('routeChangeComplete', change_complete)
    }
  }, [router])


  return (
    <Fragment>
  <Fragment>
  {isTrue(connectError !== null) ? (
  <Fragment>
  <Modal isOpen={connectError !== null}>
  <ModalOverlay>
  <ModalContent>
  <ModalHeader>
  {`Connection Error`}
</ModalHeader>
  <ModalBody>
  <Text>
  {`Cannot connect to server: `}
  {(connectError !== null) ? connectError.message : ''}
  {`. Check if server is reachable at `}
  {getEventURL().href}
</Text>
</ModalBody>
</ModalContent>
</ModalOverlay>
</Modal>
</Fragment>
) : (
  <Fragment/>
)}
</Fragment>
  <HStack alignItems={`flex-start`} sx={{"transition": "left 0.5s, width 0.5s", "position": "relative"}}>
  <Box sx={{"display": ["none", "none", "block"], "minWidth": "20em", "height": "100%", "position": "sticky", "top": "0px", "borderRight": "1px solid #F4F3F6"}}>
  <VStack sx={{"height": "100dvh"}}>
  <HStack sx={{"width": "100%", "borderBottom": "1px solid #F4F3F6", "padding": "1em"}}>
  <Image src={`/icon.svg`} sx={{"height": "2em"}}/>
  <Spacer/>
  <Link as={NextLink} href={`https://github.com/reflex-dev/reflex`}>
  <Center sx={{"boxShadow": "0px 0px 0px 1px rgba(84, 82, 95, 0.14)", "bg": "transparent", "borderRadius": "0.375rem", "_hover": {"bg": "#F5EFFE"}}}>
  <Image src={`/github.svg`} sx={{"height": "3em", "padding": "0.5em"}}/>
</Center>
</Link>
</HStack>
  <VStack alignItems={`flex-start`} sx={{"width": "100%", "overflowY": "auto", "padding": "1em"}}>
  <Link as={NextLink} href={`/`} sx={{"width": "100%"}}>
  <HStack sx={{"bg": isTrue((state.router.page.path === "/home") || (((state.router.page.path === "/") && "Home") === "Home")) ? `#F5EFFE` : `transparent`, "color": isTrue((state.router.page.path === "/home") || (((state.router.page.path === "/") && "Home") === "Home")) ? `#1A1060` : `black`, "borderRadius": "0.375rem", "boxShadow": "0px 0px 0px 1px rgba(84, 82, 95, 0.14)", "width": "100%", "paddingX": "1em"}}>
  <Image src={`/github.svg`} sx={{"height": "2.5em", "padding": "0.5em"}}/>
  <Text>
  {`Home`}
</Text>
</HStack>
</Link>
  <Link as={NextLink} href={`/dashboard`} sx={{"width": "100%"}}>
  <HStack sx={{"bg": isTrue((state.router.page.path === "/dashboard") || (((state.router.page.path === "/") && "Dashboard") === "Home")) ? `#F5EFFE` : `transparent`, "color": isTrue((state.router.page.path === "/dashboard") || (((state.router.page.path === "/") && "Dashboard") === "Home")) ? `#1A1060` : `black`, "borderRadius": "0.375rem", "boxShadow": "0px 0px 0px 1px rgba(84, 82, 95, 0.14)", "width": "100%", "paddingX": "1em"}}>
  <Image src={`/github.svg`} sx={{"height": "2.5em", "padding": "0.5em"}}/>
  <Text>
  {`Dashboard`}
</Text>
</HStack>
</Link>
  <Link as={NextLink} href={`/recorder`} sx={{"width": "100%"}}>
  <HStack sx={{"bg": isTrue((state.router.page.path === "/recorder") || (((state.router.page.path === "/") && "Recorder") === "Home")) ? `#F5EFFE` : `transparent`, "color": isTrue((state.router.page.path === "/recorder") || (((state.router.page.path === "/") && "Recorder") === "Home")) ? `#1A1060` : `black`, "borderRadius": "0.375rem", "boxShadow": "0px 0px 0px 1px rgba(84, 82, 95, 0.14)", "width": "100%", "paddingX": "1em"}}>
  <Image src={`/github.svg`} sx={{"height": "2.5em", "padding": "0.5em"}}/>
  <Text>
  {`Recorder`}
</Text>
</HStack>
</Link>
  <Link as={NextLink} href={`/settings`} sx={{"width": "100%"}}>
  <HStack sx={{"bg": isTrue((state.router.page.path === "/settings") || (((state.router.page.path === "/") && "Settings") === "Home")) ? `#F5EFFE` : `transparent`, "color": isTrue((state.router.page.path === "/settings") || (((state.router.page.path === "/") && "Settings") === "Home")) ? `#1A1060` : `black`, "borderRadius": "0.375rem", "boxShadow": "0px 0px 0px 1px rgba(84, 82, 95, 0.14)", "width": "100%", "paddingX": "1em"}}>
  <Image src={`/github.svg`} sx={{"height": "2.5em", "padding": "0.5em"}}/>
  <Text>
  {`Settings`}
</Text>
</HStack>
</Link>
</VStack>
  <Spacer/>
  <HStack sx={{"width": "100%", "borderTop": "1px solid #F4F3F6", "padding": "1em"}}>
  <Spacer/>
  <Link as={NextLink} href={`https://reflex.dev/docs/getting-started/introduction/`}>
  <Text>
  {`Docs`}
</Text>
</Link>
  <Link as={NextLink} href={`https://reflex.dev/blog/`}>
  <Text>
  {`Blog`}
</Text>
</Link>
</HStack>
</VStack>
</Box>
  <Box sx={{"paddingTop": "5em", "paddingX": ["auto", "2em"]}}>
  <Box sx={{"width": "100%", "alignItems": "flex-start", "boxShadow": "0px 0px 0px 1px rgba(84, 82, 95, 0.14)", "borderRadius": "0.375rem", "padding": "1em", "marginBottom": "2em"}}>
  <ReactMarkdown components={{"h1": ({children, ...props}) => <Heading as={`h1`} size={`2xl`} sx={{"marginY": "0.5em"}} {...props}>   {children} </Heading>, "h2": ({children, ...props}) => <Heading as={`h2`} size={`xl`} sx={{"marginY": "0.5em"}} {...props}>   {children} </Heading>, "h3": ({children, ...props}) => <Heading as={`h3`} size={`lg`} sx={{"marginY": "0.5em"}} {...props}>   {children} </Heading>, "h4": ({children, ...props}) => <Heading as={`h4`} size={`md`} sx={{"marginY": "0.5em"}} {...props}>   {children} </Heading>, "h5": ({children, ...props}) => <Heading as={`h5`} size={`sm`} sx={{"marginY": "0.5em"}} {...props}>   {children} </Heading>, "h6": ({children, ...props}) => <Heading as={`h6`} size={`xs`} sx={{"marginY": "0.5em"}} {...props}>   {children} </Heading>, "p": ({children, ...props}) => <Text sx={{"marginY": "1em"}} {...props}>   {children} </Text>, "ul": ({children, ...props}) => <UnorderedList sx={{"marginY": "1em"}} {...props}>   {children} </UnorderedList>, "ol": ({children, ...props}) => <OrderedList sx={{"marginY": "1em"}} {...props}>   {children} </OrderedList>, "li": ({children, ...props}) => <ListItem sx={{"marginY": "0.5em"}} {...props}>   {children} </ListItem>, "a": ({children, ...props}) => <Link as={``} sx={{"fontWeight": "bold", "color": "#03030B", "textDecoration": "underline", "textDecorationColor": "#AD9BF8", "_hover": {"color": "#AD9BF8", "textDecoration": "underline", "textDecorationColor": "#03030B"}}} {...props}>   {children} </Link>, "code": ({inline, className, children, ...props}) => {     const match = (className || '').match(/language-(?<lang>.*)/);     const language = match ? match[1] : '';     return inline ? (         <Code sx={{"color": "#1F1944", "bg": "#EAE4FD"}} {...props}>   {children} </Code>     ) : (         <Prism customStyle={{"marginY": "1em"}} language={language} style={light} sx={{"marginY": "1em"}} children={String(children)} {...props}/>     );       }, "codeblock": ({children, ...props}) => <Prism customStyle={{"marginY": "1em"}} style={light} sx={{"marginY": "1em"}} {...props}/>}} rehypePlugins={[rehypeKatex, rehypeRaw]} remarkPlugins={[remarkMath, remarkGfm]}>
  {`# S.T.U.D.Y.A.I

Systematic Teaching Using Dynamic Yielding and Autonomous Intelligence

---

## Overview
Studyai is a groundbreaking, voice-activated study assistant engineered to redefine the self-study experience. Utilizing cutting-edge machine learning, voice recognition, and natural language understanding technologies, this platform offers an array of features designed to facilitate efficient and effective study sessions.

---

## Inspiration
In an era flooded with information, the conventional methods of self-study are fraught with challenges like information overload, disorganized note management, and a lack of personalized learning experiences. Autostudy Buddy was conceived to tackle these issues head-on, offering a revolutionary approach to academic learning and comprehension.

---

## Goals
Our mission is to revolutionize self-study by providing an intelligent, voice-activated assistant that delivers a seamless and intuitive user experience. Autostudy Buddy aims to become the go-to platform for students, offering features like text and video summarization, explanatory image generation, educational video recommendations, and personalized note management.

---

## Built With
- **Frontend**: Reflex.dev with React components as plugins
- **Backend**: FastAPI
- **Voice Recognition and Text-to-Speech**: 11Labs, LLM
- **Autonomous Agents**: OpenAI function calling agents
- **Text Summarization**: TogetherAI
- **Image Generation**: TogetherAI
- **Database**: MindsDB
- **YouTube Integration**: MindsDB with YouTube API

---

## Challenges
- Implementing real-time voice recognition and natural language understanding.
- Ensuring seamless integration of multiple technologies, including machine learning models and external APIs.
- Achieving scalability while maintaining high performance and reliability.
- Ensuring data privacy and security.

---

## Accomplishments
- Successfully developed a voice-activated command parsing module.
- Implemented autonomous decision-making capabilities using OpenAI.
- Engineered data fetching and summarization modules with high accuracy and efficiency.
- Integrated YouTube API for enriched educational content.
- Designed an effective note management system using MindsDB.

---

## What We Learned
- How to integrate machine learning and voice recognition technologies to create a seamless user experience.
- The importance of a modular architecture for scalability and future expansions.
- How to manage and manipulate large datasets for quick and accurate retrieval.
- The nuances of user experience design, particularly for an educational tool.

---

## What's Next
- Implementing a personalized learning path based on user behavior and preferences.
- Expanding the database to include more academic resources and journals.
- Launching a mobile application to make Autostudy Buddy accessible on the go.
- Exploring partnerships with educational institutions for broader reach and impact.

---

## Functions
- **Voice Activation and Command Parsing**: Understands user needs through voice commands.
- **Autonomous Decision Making**: Adapts to the user's needs, activating the most useful tools or functionalities.
- **Text Summarization**: Offers concise, yet comprehensive, academic information.
- **Image Generation**: Provides visual aids for complex topics.
- **YouTube Video Suggestions**: Recommends relevant educational videos.
- **Note Management**: Organizes user-uploaded study notes for easy retrieval.`}
</ReactMarkdown>
</Box>
</Box>
  <Spacer/>
  <Box sx={{"position": "fixed", "right": "1.5em", "top": "1.5em", "zIndex": "500"}}>
  <Menu>
  <MenuButton sx={{"width": "3em", "height": "3em", "backgroundColor": "white", "border": "1px solid #F4F3F6", "borderRadius": "0.375rem"}}>
  <HamburgerIcon sx={{"size": "4em", "color": "black"}}/>
</MenuButton>
  <MenuList>
  <MenuItem sx={{"_hover": {"bg": "#F5EFFE"}}}>
  <Link as={NextLink} href={`/`} sx={{"width": "100%"}}>
  {`Home`}
</Link>
</MenuItem>
  <MenuItem sx={{"_hover": {"bg": "#F5EFFE"}}}>
  <Link as={NextLink} href={`/dashboard`} sx={{"width": "100%"}}>
  {`Dashboard`}
</Link>
</MenuItem>
  <MenuItem sx={{"_hover": {"bg": "#F5EFFE"}}}>
  <Link as={NextLink} href={`/recorder`} sx={{"width": "100%"}}>
  {`Recorder`}
</Link>
</MenuItem>
  <MenuItem sx={{"_hover": {"bg": "#F5EFFE"}}}>
  <Link as={NextLink} href={`/settings`} sx={{"width": "100%"}}>
  {`Settings`}
</Link>
</MenuItem>
  <MenuDivider/>
  <MenuItem sx={{"_hover": {"bg": "#F5EFFE"}}}>
  <Link as={NextLink} href={`https://github.com/reflex-dev`} sx={{"width": "100%"}}>
  {`About`}
</Link>
</MenuItem>
  <MenuItem sx={{"_hover": {"bg": "#F5EFFE"}}}>
  <Link as={NextLink} href={`mailto:founders@=reflex.dev`} sx={{"width": "100%"}}>
  {`Contact`}
</Link>
</MenuItem>
</MenuList>
</Menu>
</Box>
</HStack>
  <NextHead>
  <title>
  {`Home`}
</title>
  <meta content={`A Reflex app.`} name={`description`}/>
  <meta content={`/github.svg`} property={`og:image`}/>
  <meta content={`width=device-width, shrink-to-fit=no, initial-scale=1`} name={`viewport`}/>
</NextHead>
</Fragment>
  )
}
