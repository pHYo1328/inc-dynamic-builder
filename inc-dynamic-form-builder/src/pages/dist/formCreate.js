"use strict";
exports.__esModule = true;
var router_1 = require("next/router");
var react_1 = require("next-auth/react");
var api_1 = require("@/utils/api");
var FormCreate_1 = require("@/components/FormCreate");
var Responses_1 = require("@/components/Responses");
var react_2 = require("react");
var react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
exports["default"] = (function () {
    var _a = react_2.useState("formCreate"), currentView = _a[0], setCurrentView = _a[1];
    var _b = react_1.useSession(), sessionData = _b.data, status = _b.status;
    var loading = status === "loading";
    if (!sessionData && !loading) {
        react_1.signIn();
        return null;
    }
    var router = router_1.useRouter();
    var formId = router.query.formId;
    var _c = api_1.api.form.getFromById.useQuery({ formId: formId }), form = _c.data, isLoading = _c.isLoading;
    var shareableLink = "http://localhost:3000/" + formId;
    var copyLinkToClipboard = function () {
        navigator.clipboard.writeText(shareableLink);
        react_toastify_1.toast.success("shareable link is copied to clipboard");
    };
    if (isLoading) {
        return (React.createElement("div", null, "Loading..."));
    }
    return (React.createElement("div", { className: "bg-purple-100 min-h-screen" },
        React.createElement(react_toastify_1.ToastContainer, { position: "top-center", autoClose: 5000, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true, theme: "light" }),
        React.createElement("nav", { className: "bg-white shadow-lg my-3" },
            React.createElement("div", { className: "flex justify-end  mr-6  " },
                React.createElement("button", { onClick: copyLinkToClipboard, className: "px-3 py-1 bg-purple-500 text-white rounded" }, " Share")),
            React.createElement("ul", { className: "flex justify-center h-[50px]" },
                React.createElement("li", { className: "mr-6 " },
                    React.createElement("button", { onClick: function () { return setCurrentView("formCreate"); }, className: " hover:border-b-2 hover:border-blue-800" }, "Questions")),
                React.createElement("li", null,
                    React.createElement("button", { onClick: function () { return setCurrentView("responses"); }, className: "hover:border-b-2 hover:border-blue-800" }, "Responses")))),
        currentView === "formCreate" && React.createElement(FormCreate_1.FormCreate, { formData: form }),
        currentView === "responses" && React.createElement(Responses_1.Responses, { formData: form })));
});
