"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var SignUpInput = function () {
    var _classDecorators = [(0, graphql_1.InputType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _birthday_decorators;
    var _birthday_initializers = [];
    var _birthday_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _first_name_decorators;
    var _first_name_initializers = [];
    var _first_name_extraInitializers = [];
    var _last_name_decorators;
    var _last_name_initializers = [];
    var _last_name_extraInitializers = [];
    var _password_decorators;
    var _password_initializers = [];
    var _password_extraInitializers = [];
    var _phone_number_decorators;
    var _phone_number_initializers = [];
    var _phone_number_extraInitializers = [];
    var SignUpInput = _classThis = /** @class */ (function () {
        function SignUpInput_1() {
            this.address = __runInitializers(this, _address_initializers, void 0);
            this.birthday = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _birthday_initializers, void 0));
            this.email = (__runInitializers(this, _birthday_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.first_name = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _first_name_initializers, void 0));
            this.last_name = (__runInitializers(this, _first_name_extraInitializers), __runInitializers(this, _last_name_initializers, void 0));
            this.password = (__runInitializers(this, _last_name_extraInitializers), __runInitializers(this, _password_initializers, void 0));
            this.phone_number = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _phone_number_initializers, void 0));
            __runInitializers(this, _phone_number_extraInitializers);
        }
        return SignUpInput_1;
    }());
    __setFunctionName(_classThis, "SignUpInput");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _address_decorators = [(0, graphql_1.Field)()];
        _birthday_decorators = [(0, graphql_1.Field)()];
        _email_decorators = [(0, graphql_1.Field)()];
        _first_name_decorators = [(0, graphql_1.Field)()];
        _last_name_decorators = [(0, graphql_1.Field)()];
        _password_decorators = [(0, graphql_1.Field)()];
        _phone_number_decorators = [(0, graphql_1.Field)()];
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _birthday_decorators, { kind: "field", name: "birthday", static: false, private: false, access: { has: function (obj) { return "birthday" in obj; }, get: function (obj) { return obj.birthday; }, set: function (obj, value) { obj.birthday = value; } }, metadata: _metadata }, _birthday_initializers, _birthday_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _first_name_decorators, { kind: "field", name: "first_name", static: false, private: false, access: { has: function (obj) { return "first_name" in obj; }, get: function (obj) { return obj.first_name; }, set: function (obj, value) { obj.first_name = value; } }, metadata: _metadata }, _first_name_initializers, _first_name_extraInitializers);
        __esDecorate(null, null, _last_name_decorators, { kind: "field", name: "last_name", static: false, private: false, access: { has: function (obj) { return "last_name" in obj; }, get: function (obj) { return obj.last_name; }, set: function (obj, value) { obj.last_name = value; } }, metadata: _metadata }, _last_name_initializers, _last_name_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: function (obj) { return "password" in obj; }, get: function (obj) { return obj.password; }, set: function (obj, value) { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _phone_number_decorators, { kind: "field", name: "phone_number", static: false, private: false, access: { has: function (obj) { return "phone_number" in obj; }, get: function (obj) { return obj.phone_number; }, set: function (obj, value) { obj.phone_number = value; } }, metadata: _metadata }, _phone_number_initializers, _phone_number_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SignUpInput = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SignUpInput = _classThis;
}();
exports.SignUpInput = SignUpInput;
