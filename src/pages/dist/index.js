"use strict";
exports.__esModule = true;
var react_1 = require("next-auth/react");
var head_1 = require("next/head");
var link_1 = require("next/link");
var api_1 = require("@/utils/api");
function Home() {
    var hello = api_1.api.post.hello.useQuery({ text: "from tRPC" });
    return (React.createElement(React.Fragment, null,
        React.createElement(head_1["default"], null,
            React.createElement("title", null, "Create T3 App"),
            React.createElement("meta", { name: "description", content: "Generated by create-t3-app" }),
            React.createElement("link", { rel: "icon", href: "/favicon.ico" })),
        React.createElement("main", { className: " flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]" },
            React.createElement("div", { className: "container flex flex-col items-center justify-center gap-12 px-4 py-16 " },
                React.createElement("h1", { className: "text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]" },
                    "Create ",
                    React.createElement("span", { className: "text-[hsl(280,100%,70%)]" }, "T3"),
                    " App"),
                React.createElement("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8" },
                    React.createElement(link_1["default"], { className: "flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20", href: "https://create.t3.gg/en/usage/first-steps", target: "_blank" },
                        React.createElement("h3", { className: "text-2xl font-bold" }, "First Steps \u2192"),
                        React.createElement("div", { className: "text-lg" }, "Just the basics - Everything you need to know to set up your database and authentication.")),
                    React.createElement(link_1["default"], { className: "flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20", href: "https://create.t3.gg/en/introduction", target: "_blank" },
                        React.createElement("h3", { className: "text-2xl font-bold" }, "Documentation \u2192"),
                        React.createElement("div", { className: "text-lg" }, "Learn more about Create T3 App, the libraries it uses, and how to deploy it."))),
                React.createElement("div", { className: "flex flex-col items-center gap-2" },
                    React.createElement("p", { className: "text-2xl text-white" }, hello.data ? hello.data.greeting : "Loading tRPC query..."),
                    React.createElement(AuthShowcase, null))))));
}
exports["default"] = Home;
function AuthShowcase() {
    var _a;
    var sessionData = react_1.useSession().data;
    var secretMessage = api_1.api.post.getSecretMessage.useQuery(undefined, // no input
    { enabled: (sessionData === null || sessionData === void 0 ? void 0 : sessionData.user) !== undefined }).data;
    return (React.createElement("div", { className: "flex flex-col items-center justify-center gap-4" },
        React.createElement("p", { className: "text-center text-2xl text-white" },
            sessionData && React.createElement("span", null,
                "Logged in as ", (_a = sessionData.user) === null || _a === void 0 ? void 0 :
                _a.name),
            secretMessage && React.createElement("span", null,
                " - ",
                secretMessage)),
        React.createElement("button", { className: "rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20", onClick: sessionData ? function () { return void react_1.signOut(); } : function () { return void react_1.signIn(); } }, sessionData ? "Sign out" : "Sign in")));
}