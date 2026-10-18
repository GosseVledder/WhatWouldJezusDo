(function(){function e(e){return e}var t=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,n=/^[A-Za-z0-9_-]{11}$/;function r(e){return!!e&&n.test(e)}function i(e){if(!e)return null;let t=e.trim();if(r(t))return t;let n;try{n=new URL(t,`https://www.youtube.com`)}catch{return null}let a=n.hostname.replace(/^(www|m|music)\./,``);if(a===`youtu.be`){let e=n.pathname.split(`/`)[1];return r(e)?e:null}if(a!==`youtube.com`&&a!==`youtube-nocookie.com`)return null;let o=n.searchParams.get(`v`);if(n.pathname===`/watch`&&r(o))return o;let s=n.pathname.match(/^\/(?:embed|live|v|e)\/([A-Za-z0-9_-]{11})(?:[/?]|$)/);if(s?.[1])return s[1];if(n.pathname===`/attribution_link`){let e=n.searchParams.get(`u`);return e?i(`https://www.youtube.com${e}`):null}return null}var a={gemini:`gemini-flash-latest`,claude:`claude-haiku-5-5`},o;(function(e){e.assertEqual=e=>{};function t(e){}e.assertIs=t;function n(e){throw Error()}e.assertNever=n,e.arrayToEnum=e=>{let t={};for(let n of e)t[n]=n;return t},e.getValidEnumValues=t=>{let n=e.objectKeys(t).filter(e=>typeof t[t[e]]!=`number`),r={};for(let e of n)r[e]=t[e];return e.objectValues(r)},e.objectValues=t=>e.objectKeys(t).map(function(e){return t[e]}),e.objectKeys=typeof Object.keys==`function`?e=>Object.keys(e):e=>{let t=[];for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.push(n);return t},e.find=(e,t)=>{for(let n of e)if(t(n))return n},e.isInteger=typeof Number.isInteger==`function`?e=>Number.isInteger(e):e=>typeof e==`number`&&Number.isFinite(e)&&Math.floor(e)===e;function r(e,t=` | `){return e.map(e=>typeof e==`string`?`'${e}'`:e).join(t)}e.joinValues=r,e.jsonStringifyReplacer=(e,t)=>typeof t==`bigint`?t.toString():t})(o||={});var s;(function(e){e.mergeShapes=(e,t)=>({...e,...t})})(s||={});var c=o.arrayToEnum([`string`,`nan`,`number`,`integer`,`float`,`boolean`,`date`,`bigint`,`symbol`,`function`,`undefined`,`null`,`array`,`object`,`unknown`,`promise`,`void`,`never`,`map`,`set`]),l=e=>{switch(typeof e){case`undefined`:return c.undefined;case`string`:return c.string;case`number`:return Number.isNaN(e)?c.nan:c.number;case`boolean`:return c.boolean;case`function`:return c.function;case`bigint`:return c.bigint;case`symbol`:return c.symbol;case`object`:return Array.isArray(e)?c.array:e===null?c.null:e.then&&typeof e.then==`function`&&e.catch&&typeof e.catch==`function`?c.promise:typeof Map<`u`&&e instanceof Map?c.map:typeof Set<`u`&&e instanceof Set?c.set:typeof Date<`u`&&e instanceof Date?c.date:c.object;default:return c.unknown}},u=o.arrayToEnum([`invalid_type`,`invalid_literal`,`custom`,`invalid_union`,`invalid_union_discriminator`,`invalid_enum_value`,`unrecognized_keys`,`invalid_arguments`,`invalid_return_type`,`invalid_date`,`invalid_string`,`too_small`,`too_big`,`invalid_intersection_types`,`not_multiple_of`,`not_finite`]),d=class e extends Error{get errors(){return this.issues}constructor(e){super(),this.issues=[],this.addIssue=e=>{this.issues=[...this.issues,e]},this.addIssues=(e=[])=>{this.issues=[...this.issues,...e]};let t=new.target.prototype;Object.setPrototypeOf?Object.setPrototypeOf(this,t):this.__proto__=t,this.name=`ZodError`,this.issues=e}format(e){let t=e||function(e){return e.message},n={_errors:[]},r=e=>{for(let i of e.issues)if(i.code===`invalid_union`)i.unionErrors.map(r);else if(i.code===`invalid_return_type`)r(i.returnTypeError);else if(i.code===`invalid_arguments`)r(i.argumentsError);else if(i.path.length===0)n._errors.push(t(i));else{let e=n,r=0;for(;r<i.path.length;){let n=i.path[r];r===i.path.length-1?(e[n]=e[n]||{_errors:[]},e[n]._errors.push(t(i))):e[n]=e[n]||{_errors:[]},e=e[n],r++}}};return r(this),n}static assert(t){if(!(t instanceof e))throw Error(`Not a ZodError: ${t}`)}toString(){return this.message}get message(){return JSON.stringify(this.issues,o.jsonStringifyReplacer,2)}get isEmpty(){return this.issues.length===0}flatten(e=e=>e.message){let t={},n=[];for(let r of this.issues)if(r.path.length>0){let n=r.path[0];t[n]=t[n]||[],t[n].push(e(r))}else n.push(e(r));return{formErrors:n,fieldErrors:t}}get formErrors(){return this.flatten()}};d.create=e=>new d(e);var f=(e,t)=>{let n;switch(e.code){case u.invalid_type:n=e.received===c.undefined?`Required`:`Expected ${e.expected}, received ${e.received}`;break;case u.invalid_literal:n=`Invalid literal value, expected ${JSON.stringify(e.expected,o.jsonStringifyReplacer)}`;break;case u.unrecognized_keys:n=`Unrecognized key(s) in object: ${o.joinValues(e.keys,`, `)}`;break;case u.invalid_union:n=`Invalid input`;break;case u.invalid_union_discriminator:n=`Invalid discriminator value. Expected ${o.joinValues(e.options)}`;break;case u.invalid_enum_value:n=`Invalid enum value. Expected ${o.joinValues(e.options)}, received '${e.received}'`;break;case u.invalid_arguments:n=`Invalid function arguments`;break;case u.invalid_return_type:n=`Invalid function return type`;break;case u.invalid_date:n=`Invalid date`;break;case u.invalid_string:typeof e.validation==`object`?`includes`in e.validation?(n=`Invalid input: must include "${e.validation.includes}"`,typeof e.validation.position==`number`&&(n=`${n} at one or more positions greater than or equal to ${e.validation.position}`)):`startsWith`in e.validation?n=`Invalid input: must start with "${e.validation.startsWith}"`:`endsWith`in e.validation?n=`Invalid input: must end with "${e.validation.endsWith}"`:o.assertNever(e.validation):n=e.validation===`regex`?`Invalid`:`Invalid ${e.validation}`;break;case u.too_small:n=e.type===`array`?`Array must contain ${e.exact?`exactly`:e.inclusive?`at least`:`more than`} ${e.minimum} element(s)`:e.type===`string`?`String must contain ${e.exact?`exactly`:e.inclusive?`at least`:`over`} ${e.minimum} character(s)`:e.type===`number`||e.type===`bigint`?`Number must be ${e.exact?`exactly equal to `:e.inclusive?`greater than or equal to `:`greater than `}${e.minimum}`:e.type===`date`?`Date must be ${e.exact?`exactly equal to `:e.inclusive?`greater than or equal to `:`greater than `}${new Date(Number(e.minimum))}`:`Invalid input`;break;case u.too_big:n=e.type===`array`?`Array must contain ${e.exact?`exactly`:e.inclusive?`at most`:`less than`} ${e.maximum} element(s)`:e.type===`string`?`String must contain ${e.exact?`exactly`:e.inclusive?`at most`:`under`} ${e.maximum} character(s)`:e.type===`number`?`Number must be ${e.exact?`exactly`:e.inclusive?`less than or equal to`:`less than`} ${e.maximum}`:e.type===`bigint`?`BigInt must be ${e.exact?`exactly`:e.inclusive?`less than or equal to`:`less than`} ${e.maximum}`:e.type===`date`?`Date must be ${e.exact?`exactly`:e.inclusive?`smaller than or equal to`:`smaller than`} ${new Date(Number(e.maximum))}`:`Invalid input`;break;case u.custom:n=`Invalid input`;break;case u.invalid_intersection_types:n=`Intersection results could not be merged`;break;case u.not_multiple_of:n=`Number must be a multiple of ${e.multipleOf}`;break;case u.not_finite:n=`Number must be finite`;break;default:n=t.defaultError,o.assertNever(e)}return{message:n}},p=f;function m(){return p}var h=e=>{let{data:t,path:n,errorMaps:r,issueData:i}=e,a=[...n,...i.path||[]],o={...i,path:a};if(i.message!==void 0)return{...i,path:a,message:i.message};let s=``,c=r.filter(e=>!!e).slice().reverse();for(let e of c)s=e(o,{data:t,defaultError:s}).message;return{...i,path:a,message:s}};function g(e,t){let n=m(),r=h({issueData:t,data:e.data,path:e.path,errorMaps:[e.common.contextualErrorMap,e.schemaErrorMap,n,n===f?void 0:f].filter(e=>!!e)});e.common.issues.push(r)}var _=class e{constructor(){this.value=`valid`}dirty(){this.value===`valid`&&(this.value=`dirty`)}abort(){this.value!==`aborted`&&(this.value=`aborted`)}static mergeArray(e,t){let n=[];for(let r of t){if(r.status===`aborted`)return v;r.status===`dirty`&&e.dirty(),n.push(r.value)}return{status:e.value,value:n}}static async mergeObjectAsync(t,n){let r=[];for(let e of n){let t=await e.key,n=await e.value;r.push({key:t,value:n})}return e.mergeObjectSync(t,r)}static mergeObjectSync(e,t){let n={};for(let r of t){let{key:t,value:i}=r;if(t.status===`aborted`||i.status===`aborted`)return v;t.status===`dirty`&&e.dirty(),i.status===`dirty`&&e.dirty(),t.value!==`__proto__`&&(i.value!==void 0||r.alwaysSet)&&(n[t.value]=i.value)}return{status:e.value,value:n}}},v=Object.freeze({status:`aborted`}),y=e=>({status:`dirty`,value:e}),b=e=>({status:`valid`,value:e}),ee=e=>e.status===`aborted`,te=e=>e.status===`dirty`,x=e=>e.status===`valid`,S=e=>typeof Promise<`u`&&e instanceof Promise,C;(function(e){e.errToObj=e=>typeof e==`string`?{message:e}:e||{},e.toString=e=>typeof e==`string`?e:e?.message})(C||={});var w=class{constructor(e,t,n,r){this._cachedPath=[],this.parent=e,this.data=t,this._path=n,this._key=r}get path(){return this._cachedPath.length||(Array.isArray(this._key)?this._cachedPath.push(...this._path,...this._key):this._cachedPath.push(...this._path,this._key)),this._cachedPath}},ne=(e,t)=>{if(x(t))return{success:!0,data:t.value};if(!e.common.issues.length)throw Error(`Validation failed but no issues detected.`);return{success:!1,get error(){if(this._error)return this._error;let t=new d(e.common.issues);return this._error=t,this._error}}};function T(e){if(!e)return{};let{errorMap:t,invalid_type_error:n,required_error:r,description:i}=e;if(t&&(n||r))throw Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);return t?{errorMap:t,description:i}:{errorMap:(t,i)=>{let{message:a}=e;return t.code===`invalid_enum_value`?{message:a??i.defaultError}:i.data===void 0?{message:a??r??i.defaultError}:t.code===`invalid_type`?{message:a??n??i.defaultError}:{message:i.defaultError}},description:i}}var E=class{get description(){return this._def.description}_getType(e){return l(e.data)}_getOrReturnCtx(e,t){return t||{common:e.parent.common,data:e.data,parsedType:l(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}_processInputParams(e){return{status:new _,ctx:{common:e.parent.common,data:e.data,parsedType:l(e.data),schemaErrorMap:this._def.errorMap,path:e.path,parent:e.parent}}}_parseSync(e){let t=this._parse(e);if(S(t))throw Error(`Synchronous parse encountered promise.`);return t}_parseAsync(e){let t=this._parse(e);return Promise.resolve(t)}parse(e,t){let n=this.safeParse(e,t);if(n.success)return n.data;throw n.error}safeParse(e,t){let n={common:{issues:[],async:t?.async??!1,contextualErrorMap:t?.errorMap},path:t?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:l(e)};return ne(n,this._parseSync({data:e,path:n.path,parent:n}))}"~validate"(e){let t={common:{issues:[],async:!!this[`~standard`].async},path:[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:l(e)};if(!this[`~standard`].async)try{let n=this._parseSync({data:e,path:[],parent:t});return x(n)?{value:n.value}:{issues:t.common.issues}}catch(e){e?.message?.toLowerCase()?.includes(`encountered`)&&(this[`~standard`].async=!0),t.common={issues:[],async:!0}}return this._parseAsync({data:e,path:[],parent:t}).then(e=>x(e)?{value:e.value}:{issues:t.common.issues})}async parseAsync(e,t){let n=await this.safeParseAsync(e,t);if(n.success)return n.data;throw n.error}async safeParseAsync(e,t){let n={common:{issues:[],contextualErrorMap:t?.errorMap,async:!0},path:t?.path||[],schemaErrorMap:this._def.errorMap,parent:null,data:e,parsedType:l(e)},r=this._parse({data:e,path:n.path,parent:n});return ne(n,await(S(r)?r:Promise.resolve(r)))}refine(e,t){let n=e=>typeof t==`string`||t===void 0?{message:t}:typeof t==`function`?t(e):t;return this._refinement((t,r)=>{let i=e(t),a=()=>r.addIssue({code:u.custom,...n(t)});return typeof Promise<`u`&&i instanceof Promise?i.then(e=>e?!0:(a(),!1)):i?!0:(a(),!1)})}refinement(e,t){return this._refinement((n,r)=>e(n)?!0:(r.addIssue(typeof t==`function`?t(n,r):t),!1))}_refinement(e){return new B({schema:this,typeName:K.ZodEffects,effect:{type:`refinement`,refinement:e}})}superRefine(e){return this._refinement(e)}constructor(e){this.spa=this.safeParseAsync,this._def=e,this.parse=this.parse.bind(this),this.safeParse=this.safeParse.bind(this),this.parseAsync=this.parseAsync.bind(this),this.safeParseAsync=this.safeParseAsync.bind(this),this.spa=this.spa.bind(this),this.refine=this.refine.bind(this),this.refinement=this.refinement.bind(this),this.superRefine=this.superRefine.bind(this),this.optional=this.optional.bind(this),this.nullable=this.nullable.bind(this),this.nullish=this.nullish.bind(this),this.array=this.array.bind(this),this.promise=this.promise.bind(this),this.or=this.or.bind(this),this.and=this.and.bind(this),this.transform=this.transform.bind(this),this.brand=this.brand.bind(this),this.default=this.default.bind(this),this.catch=this.catch.bind(this),this.describe=this.describe.bind(this),this.pipe=this.pipe.bind(this),this.readonly=this.readonly.bind(this),this.isNullable=this.isNullable.bind(this),this.isOptional=this.isOptional.bind(this),this[`~standard`]={version:1,vendor:`zod`,validate:e=>this[`~validate`](e)}}optional(){return V.create(this,this._def)}nullable(){return H.create(this,this._def)}nullish(){return this.nullable().optional()}array(){return A.create(this)}promise(){return z.create(this,this._def)}or(e){return N.create([this,e],this._def)}and(e){return F.create(this,e,this._def)}transform(e){return new B({...T(this._def),schema:this,typeName:K.ZodEffects,effect:{type:`transform`,transform:e}})}default(e){let t=typeof e==`function`?e:()=>e;return new U({...T(this._def),innerType:this,defaultValue:t,typeName:K.ZodDefault})}brand(){return new qe({typeName:K.ZodBranded,type:this,...T(this._def)})}catch(e){let t=typeof e==`function`?e:()=>e;return new W({...T(this._def),innerType:this,catchValue:t,typeName:K.ZodCatch})}describe(e){let t=this.constructor;return new t({...this._def,description:e})}pipe(e){return Je.create(this,e)}readonly(){return G.create(this)}isOptional(){return this.safeParse(void 0).success}isNullable(){return this.safeParse(null).success}},re=/^c[^\s-]{8,}$/i,ie=/^[0-9a-z]+$/,ae=/^[0-9A-HJKMNP-TV-Z]{26}$/i,oe=/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,se=/^[a-z0-9_-]{21}$/i,ce=/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,le=/^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,ue=/^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,de=`^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`,fe,pe=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,me=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,he=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,ge=/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,_e=/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,ve=/^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,ye=`((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`,be=RegExp(`^${ye}$`);function xe(e){let t=`[0-5]\\d`;e.precision?t=`${t}\\.\\d{${e.precision}}`:e.precision??(t=`${t}(\\.\\d+)?`);let n=e.precision?`+`:`?`;return`([01]\\d|2[0-3]):[0-5]\\d(:${t})${n}`}function Se(e){return RegExp(`^${xe(e)}$`)}function Ce(e){let t=`${ye}T${xe(e)}`,n=[];return n.push(e.local?`Z?`:`Z`),e.offset&&n.push(`([+-]\\d{2}:?\\d{2})`),t=`${t}(${n.join(`|`)})`,RegExp(`^${t}$`)}function we(e,t){return!((t!==`v4`&&t||!pe.test(e))&&(t!==`v6`&&t||!he.test(e)))}function Te(e,t){if(!ce.test(e))return!1;try{let[n]=e.split(`.`);if(!n)return!1;let r=n.replace(/-/g,`+`).replace(/_/g,`/`).padEnd(n.length+(4-n.length%4)%4,`=`),i=JSON.parse(atob(r));return!(typeof i!=`object`||!i||`typ`in i&&i?.typ!==`JWT`||!i.alg||t&&i.alg!==t)}catch{return!1}}function Ee(e,t){return!((t!==`v4`&&t||!me.test(e))&&(t!==`v6`&&t||!ge.test(e)))}var D=class e extends E{_parse(e){if(this._def.coerce&&(e.data=String(e.data)),this._getType(e)!==c.string){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.string,received:t.parsedType}),v}let t=new _,n;for(let r of this._def.checks)if(r.kind===`min`)e.data.length<r.value&&(n=this._getOrReturnCtx(e,n),g(n,{code:u.too_small,minimum:r.value,type:`string`,inclusive:!0,exact:!1,message:r.message}),t.dirty());else if(r.kind===`max`)e.data.length>r.value&&(n=this._getOrReturnCtx(e,n),g(n,{code:u.too_big,maximum:r.value,type:`string`,inclusive:!0,exact:!1,message:r.message}),t.dirty());else if(r.kind===`length`){let i=e.data.length>r.value,a=e.data.length<r.value;(i||a)&&(n=this._getOrReturnCtx(e,n),i?g(n,{code:u.too_big,maximum:r.value,type:`string`,inclusive:!0,exact:!0,message:r.message}):a&&g(n,{code:u.too_small,minimum:r.value,type:`string`,inclusive:!0,exact:!0,message:r.message}),t.dirty())}else if(r.kind===`email`)ue.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`email`,code:u.invalid_string,message:r.message}),t.dirty());else if(r.kind===`emoji`)fe||=new RegExp(de,`u`),fe.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`emoji`,code:u.invalid_string,message:r.message}),t.dirty());else if(r.kind===`uuid`)oe.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`uuid`,code:u.invalid_string,message:r.message}),t.dirty());else if(r.kind===`nanoid`)se.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`nanoid`,code:u.invalid_string,message:r.message}),t.dirty());else if(r.kind===`cuid`)re.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`cuid`,code:u.invalid_string,message:r.message}),t.dirty());else if(r.kind===`cuid2`)ie.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`cuid2`,code:u.invalid_string,message:r.message}),t.dirty());else if(r.kind===`ulid`)ae.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`ulid`,code:u.invalid_string,message:r.message}),t.dirty());else if(r.kind===`url`)try{new URL(e.data)}catch{n=this._getOrReturnCtx(e,n),g(n,{validation:`url`,code:u.invalid_string,message:r.message}),t.dirty()}else r.kind===`regex`?(r.regex.lastIndex=0,r.regex.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`regex`,code:u.invalid_string,message:r.message}),t.dirty())):r.kind===`trim`?e.data=e.data.trim():r.kind===`includes`?e.data.includes(r.value,r.position)||(n=this._getOrReturnCtx(e,n),g(n,{code:u.invalid_string,validation:{includes:r.value,position:r.position},message:r.message}),t.dirty()):r.kind===`toLowerCase`?e.data=e.data.toLowerCase():r.kind===`toUpperCase`?e.data=e.data.toUpperCase():r.kind===`startsWith`?e.data.startsWith(r.value)||(n=this._getOrReturnCtx(e,n),g(n,{code:u.invalid_string,validation:{startsWith:r.value},message:r.message}),t.dirty()):r.kind===`endsWith`?e.data.endsWith(r.value)||(n=this._getOrReturnCtx(e,n),g(n,{code:u.invalid_string,validation:{endsWith:r.value},message:r.message}),t.dirty()):r.kind===`datetime`?Ce(r).test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{code:u.invalid_string,validation:`datetime`,message:r.message}),t.dirty()):r.kind===`date`?be.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{code:u.invalid_string,validation:`date`,message:r.message}),t.dirty()):r.kind===`time`?Se(r).test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{code:u.invalid_string,validation:`time`,message:r.message}),t.dirty()):r.kind===`duration`?le.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`duration`,code:u.invalid_string,message:r.message}),t.dirty()):r.kind===`ip`?we(e.data,r.version)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`ip`,code:u.invalid_string,message:r.message}),t.dirty()):r.kind===`jwt`?Te(e.data,r.alg)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`jwt`,code:u.invalid_string,message:r.message}),t.dirty()):r.kind===`cidr`?Ee(e.data,r.version)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`cidr`,code:u.invalid_string,message:r.message}),t.dirty()):r.kind===`base64`?_e.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`base64`,code:u.invalid_string,message:r.message}),t.dirty()):r.kind===`base64url`?ve.test(e.data)||(n=this._getOrReturnCtx(e,n),g(n,{validation:`base64url`,code:u.invalid_string,message:r.message}),t.dirty()):o.assertNever(r);return{status:t.value,value:e.data}}_regex(e,t,n){return this.refinement(t=>e.test(t),{validation:t,code:u.invalid_string,...C.errToObj(n)})}_addCheck(t){return new e({...this._def,checks:[...this._def.checks,t]})}email(e){return this._addCheck({kind:`email`,...C.errToObj(e)})}url(e){return this._addCheck({kind:`url`,...C.errToObj(e)})}emoji(e){return this._addCheck({kind:`emoji`,...C.errToObj(e)})}uuid(e){return this._addCheck({kind:`uuid`,...C.errToObj(e)})}nanoid(e){return this._addCheck({kind:`nanoid`,...C.errToObj(e)})}cuid(e){return this._addCheck({kind:`cuid`,...C.errToObj(e)})}cuid2(e){return this._addCheck({kind:`cuid2`,...C.errToObj(e)})}ulid(e){return this._addCheck({kind:`ulid`,...C.errToObj(e)})}base64(e){return this._addCheck({kind:`base64`,...C.errToObj(e)})}base64url(e){return this._addCheck({kind:`base64url`,...C.errToObj(e)})}jwt(e){return this._addCheck({kind:`jwt`,...C.errToObj(e)})}ip(e){return this._addCheck({kind:`ip`,...C.errToObj(e)})}cidr(e){return this._addCheck({kind:`cidr`,...C.errToObj(e)})}datetime(e){return typeof e==`string`?this._addCheck({kind:`datetime`,precision:null,offset:!1,local:!1,message:e}):this._addCheck({kind:`datetime`,precision:e?.precision===void 0?null:e?.precision,offset:e?.offset??!1,local:e?.local??!1,...C.errToObj(e?.message)})}date(e){return this._addCheck({kind:`date`,message:e})}time(e){return typeof e==`string`?this._addCheck({kind:`time`,precision:null,message:e}):this._addCheck({kind:`time`,precision:e?.precision===void 0?null:e?.precision,...C.errToObj(e?.message)})}duration(e){return this._addCheck({kind:`duration`,...C.errToObj(e)})}regex(e,t){return this._addCheck({kind:`regex`,regex:e,...C.errToObj(t)})}includes(e,t){return this._addCheck({kind:`includes`,value:e,position:t?.position,...C.errToObj(t?.message)})}startsWith(e,t){return this._addCheck({kind:`startsWith`,value:e,...C.errToObj(t)})}endsWith(e,t){return this._addCheck({kind:`endsWith`,value:e,...C.errToObj(t)})}min(e,t){return this._addCheck({kind:`min`,value:e,...C.errToObj(t)})}max(e,t){return this._addCheck({kind:`max`,value:e,...C.errToObj(t)})}length(e,t){return this._addCheck({kind:`length`,value:e,...C.errToObj(t)})}nonempty(e){return this.min(1,C.errToObj(e))}trim(){return new e({...this._def,checks:[...this._def.checks,{kind:`trim`}]})}toLowerCase(){return new e({...this._def,checks:[...this._def.checks,{kind:`toLowerCase`}]})}toUpperCase(){return new e({...this._def,checks:[...this._def.checks,{kind:`toUpperCase`}]})}get isDatetime(){return!!this._def.checks.find(e=>e.kind===`datetime`)}get isDate(){return!!this._def.checks.find(e=>e.kind===`date`)}get isTime(){return!!this._def.checks.find(e=>e.kind===`time`)}get isDuration(){return!!this._def.checks.find(e=>e.kind===`duration`)}get isEmail(){return!!this._def.checks.find(e=>e.kind===`email`)}get isURL(){return!!this._def.checks.find(e=>e.kind===`url`)}get isEmoji(){return!!this._def.checks.find(e=>e.kind===`emoji`)}get isUUID(){return!!this._def.checks.find(e=>e.kind===`uuid`)}get isNANOID(){return!!this._def.checks.find(e=>e.kind===`nanoid`)}get isCUID(){return!!this._def.checks.find(e=>e.kind===`cuid`)}get isCUID2(){return!!this._def.checks.find(e=>e.kind===`cuid2`)}get isULID(){return!!this._def.checks.find(e=>e.kind===`ulid`)}get isIP(){return!!this._def.checks.find(e=>e.kind===`ip`)}get isCIDR(){return!!this._def.checks.find(e=>e.kind===`cidr`)}get isBase64(){return!!this._def.checks.find(e=>e.kind===`base64`)}get isBase64url(){return!!this._def.checks.find(e=>e.kind===`base64url`)}get minLength(){let e=null;for(let t of this._def.checks)t.kind===`min`&&(e===null||t.value>e)&&(e=t.value);return e}get maxLength(){let e=null;for(let t of this._def.checks)t.kind===`max`&&(e===null||t.value<e)&&(e=t.value);return e}};D.create=e=>new D({checks:[],typeName:K.ZodString,coerce:e?.coerce??!1,...T(e)});function De(e,t){let n=(e.toString().split(`.`)[1]||``).length,r=(t.toString().split(`.`)[1]||``).length,i=n>r?n:r;return Number.parseInt(e.toFixed(i).replace(`.`,``))%Number.parseInt(t.toFixed(i).replace(`.`,``))/10**i}var Oe=class e extends E{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte,this.step=this.multipleOf}_parse(e){if(this._def.coerce&&(e.data=Number(e.data)),this._getType(e)!==c.number){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.number,received:t.parsedType}),v}let t,n=new _;for(let r of this._def.checks)r.kind===`int`?o.isInteger(e.data)||(t=this._getOrReturnCtx(e,t),g(t,{code:u.invalid_type,expected:`integer`,received:`float`,message:r.message}),n.dirty()):r.kind===`min`?(r.inclusive?e.data<r.value:e.data<=r.value)&&(t=this._getOrReturnCtx(e,t),g(t,{code:u.too_small,minimum:r.value,type:`number`,inclusive:r.inclusive,exact:!1,message:r.message}),n.dirty()):r.kind===`max`?(r.inclusive?e.data>r.value:e.data>=r.value)&&(t=this._getOrReturnCtx(e,t),g(t,{code:u.too_big,maximum:r.value,type:`number`,inclusive:r.inclusive,exact:!1,message:r.message}),n.dirty()):r.kind===`multipleOf`?De(e.data,r.value)!==0&&(t=this._getOrReturnCtx(e,t),g(t,{code:u.not_multiple_of,multipleOf:r.value,message:r.message}),n.dirty()):r.kind===`finite`?Number.isFinite(e.data)||(t=this._getOrReturnCtx(e,t),g(t,{code:u.not_finite,message:r.message}),n.dirty()):o.assertNever(r);return{status:n.value,value:e.data}}gte(e,t){return this.setLimit(`min`,e,!0,C.toString(t))}gt(e,t){return this.setLimit(`min`,e,!1,C.toString(t))}lte(e,t){return this.setLimit(`max`,e,!0,C.toString(t))}lt(e,t){return this.setLimit(`max`,e,!1,C.toString(t))}setLimit(t,n,r,i){return new e({...this._def,checks:[...this._def.checks,{kind:t,value:n,inclusive:r,message:C.toString(i)}]})}_addCheck(t){return new e({...this._def,checks:[...this._def.checks,t]})}int(e){return this._addCheck({kind:`int`,message:C.toString(e)})}positive(e){return this._addCheck({kind:`min`,value:0,inclusive:!1,message:C.toString(e)})}negative(e){return this._addCheck({kind:`max`,value:0,inclusive:!1,message:C.toString(e)})}nonpositive(e){return this._addCheck({kind:`max`,value:0,inclusive:!0,message:C.toString(e)})}nonnegative(e){return this._addCheck({kind:`min`,value:0,inclusive:!0,message:C.toString(e)})}multipleOf(e,t){return this._addCheck({kind:`multipleOf`,value:e,message:C.toString(t)})}finite(e){return this._addCheck({kind:`finite`,message:C.toString(e)})}safe(e){return this._addCheck({kind:`min`,inclusive:!0,value:-(2**53-1),message:C.toString(e)})._addCheck({kind:`max`,inclusive:!0,value:2**53-1,message:C.toString(e)})}get minValue(){let e=null;for(let t of this._def.checks)t.kind===`min`&&(e===null||t.value>e)&&(e=t.value);return e}get maxValue(){let e=null;for(let t of this._def.checks)t.kind===`max`&&(e===null||t.value<e)&&(e=t.value);return e}get isInt(){return!!this._def.checks.find(e=>e.kind===`int`||e.kind===`multipleOf`&&o.isInteger(e.value))}get isFinite(){let e=null,t=null;for(let n of this._def.checks)if(n.kind===`finite`||n.kind===`int`||n.kind===`multipleOf`)return!0;else n.kind===`min`?(t===null||n.value>t)&&(t=n.value):n.kind===`max`&&(e===null||n.value<e)&&(e=n.value);return Number.isFinite(t)&&Number.isFinite(e)}};Oe.create=e=>new Oe({checks:[],typeName:K.ZodNumber,coerce:e?.coerce||!1,...T(e)});var ke=class e extends E{constructor(){super(...arguments),this.min=this.gte,this.max=this.lte}_parse(e){if(this._def.coerce)try{e.data=BigInt(e.data)}catch{return this._getInvalidInput(e)}if(this._getType(e)!==c.bigint)return this._getInvalidInput(e);let t,n=new _;for(let r of this._def.checks)r.kind===`min`?(r.inclusive?e.data<r.value:e.data<=r.value)&&(t=this._getOrReturnCtx(e,t),g(t,{code:u.too_small,type:`bigint`,minimum:r.value,inclusive:r.inclusive,message:r.message}),n.dirty()):r.kind===`max`?(r.inclusive?e.data>r.value:e.data>=r.value)&&(t=this._getOrReturnCtx(e,t),g(t,{code:u.too_big,type:`bigint`,maximum:r.value,inclusive:r.inclusive,message:r.message}),n.dirty()):r.kind===`multipleOf`?e.data%r.value!==BigInt(0)&&(t=this._getOrReturnCtx(e,t),g(t,{code:u.not_multiple_of,multipleOf:r.value,message:r.message}),n.dirty()):o.assertNever(r);return{status:n.value,value:e.data}}_getInvalidInput(e){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.bigint,received:t.parsedType}),v}gte(e,t){return this.setLimit(`min`,e,!0,C.toString(t))}gt(e,t){return this.setLimit(`min`,e,!1,C.toString(t))}lte(e,t){return this.setLimit(`max`,e,!0,C.toString(t))}lt(e,t){return this.setLimit(`max`,e,!1,C.toString(t))}setLimit(t,n,r,i){return new e({...this._def,checks:[...this._def.checks,{kind:t,value:n,inclusive:r,message:C.toString(i)}]})}_addCheck(t){return new e({...this._def,checks:[...this._def.checks,t]})}positive(e){return this._addCheck({kind:`min`,value:BigInt(0),inclusive:!1,message:C.toString(e)})}negative(e){return this._addCheck({kind:`max`,value:BigInt(0),inclusive:!1,message:C.toString(e)})}nonpositive(e){return this._addCheck({kind:`max`,value:BigInt(0),inclusive:!0,message:C.toString(e)})}nonnegative(e){return this._addCheck({kind:`min`,value:BigInt(0),inclusive:!0,message:C.toString(e)})}multipleOf(e,t){return this._addCheck({kind:`multipleOf`,value:e,message:C.toString(t)})}get minValue(){let e=null;for(let t of this._def.checks)t.kind===`min`&&(e===null||t.value>e)&&(e=t.value);return e}get maxValue(){let e=null;for(let t of this._def.checks)t.kind===`max`&&(e===null||t.value<e)&&(e=t.value);return e}};ke.create=e=>new ke({checks:[],typeName:K.ZodBigInt,coerce:e?.coerce??!1,...T(e)});var Ae=class extends E{_parse(e){if(this._def.coerce&&(e.data=!!e.data),this._getType(e)!==c.boolean){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.boolean,received:t.parsedType}),v}return b(e.data)}};Ae.create=e=>new Ae({typeName:K.ZodBoolean,coerce:e?.coerce||!1,...T(e)});var je=class e extends E{_parse(e){if(this._def.coerce&&(e.data=new Date(e.data)),this._getType(e)!==c.date){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.date,received:t.parsedType}),v}if(Number.isNaN(e.data.getTime()))return g(this._getOrReturnCtx(e),{code:u.invalid_date}),v;let t=new _,n;for(let r of this._def.checks)r.kind===`min`?e.data.getTime()<r.value&&(n=this._getOrReturnCtx(e,n),g(n,{code:u.too_small,message:r.message,inclusive:!0,exact:!1,minimum:r.value,type:`date`}),t.dirty()):r.kind===`max`?e.data.getTime()>r.value&&(n=this._getOrReturnCtx(e,n),g(n,{code:u.too_big,message:r.message,inclusive:!0,exact:!1,maximum:r.value,type:`date`}),t.dirty()):o.assertNever(r);return{status:t.value,value:new Date(e.data.getTime())}}_addCheck(t){return new e({...this._def,checks:[...this._def.checks,t]})}min(e,t){return this._addCheck({kind:`min`,value:e.getTime(),message:C.toString(t)})}max(e,t){return this._addCheck({kind:`max`,value:e.getTime(),message:C.toString(t)})}get minDate(){let e=null;for(let t of this._def.checks)t.kind===`min`&&(e===null||t.value>e)&&(e=t.value);return e==null?null:new Date(e)}get maxDate(){let e=null;for(let t of this._def.checks)t.kind===`max`&&(e===null||t.value<e)&&(e=t.value);return e==null?null:new Date(e)}};je.create=e=>new je({checks:[],coerce:e?.coerce||!1,typeName:K.ZodDate,...T(e)});var Me=class extends E{_parse(e){if(this._getType(e)!==c.symbol){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.symbol,received:t.parsedType}),v}return b(e.data)}};Me.create=e=>new Me({typeName:K.ZodSymbol,...T(e)});var Ne=class extends E{_parse(e){if(this._getType(e)!==c.undefined){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.undefined,received:t.parsedType}),v}return b(e.data)}};Ne.create=e=>new Ne({typeName:K.ZodUndefined,...T(e)});var Pe=class extends E{_parse(e){if(this._getType(e)!==c.null){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.null,received:t.parsedType}),v}return b(e.data)}};Pe.create=e=>new Pe({typeName:K.ZodNull,...T(e)});var Fe=class extends E{constructor(){super(...arguments),this._any=!0}_parse(e){return b(e.data)}};Fe.create=e=>new Fe({typeName:K.ZodAny,...T(e)});var O=class extends E{constructor(){super(...arguments),this._unknown=!0}_parse(e){return b(e.data)}};O.create=e=>new O({typeName:K.ZodUnknown,...T(e)});var k=class extends E{_parse(e){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.never,received:t.parsedType}),v}};k.create=e=>new k({typeName:K.ZodNever,...T(e)});var Ie=class extends E{_parse(e){if(this._getType(e)!==c.undefined){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.void,received:t.parsedType}),v}return b(e.data)}};Ie.create=e=>new Ie({typeName:K.ZodVoid,...T(e)});var A=class e extends E{_parse(e){let{ctx:t,status:n}=this._processInputParams(e),r=this._def;if(t.parsedType!==c.array)return g(t,{code:u.invalid_type,expected:c.array,received:t.parsedType}),v;if(r.exactLength!==null){let e=t.data.length>r.exactLength.value,i=t.data.length<r.exactLength.value;(e||i)&&(g(t,{code:e?u.too_big:u.too_small,minimum:i?r.exactLength.value:void 0,maximum:e?r.exactLength.value:void 0,type:`array`,inclusive:!0,exact:!0,message:r.exactLength.message}),n.dirty())}if(r.minLength!==null&&t.data.length<r.minLength.value&&(g(t,{code:u.too_small,minimum:r.minLength.value,type:`array`,inclusive:!0,exact:!1,message:r.minLength.message}),n.dirty()),r.maxLength!==null&&t.data.length>r.maxLength.value&&(g(t,{code:u.too_big,maximum:r.maxLength.value,type:`array`,inclusive:!0,exact:!1,message:r.maxLength.message}),n.dirty()),t.common.async)return Promise.all([...t.data].map((e,n)=>r.type._parseAsync(new w(t,e,t.path,n)))).then(e=>_.mergeArray(n,e));let i=[...t.data].map((e,n)=>r.type._parseSync(new w(t,e,t.path,n)));return _.mergeArray(n,i)}get element(){return this._def.type}min(t,n){return new e({...this._def,minLength:{value:t,message:C.toString(n)}})}max(t,n){return new e({...this._def,maxLength:{value:t,message:C.toString(n)}})}length(t,n){return new e({...this._def,exactLength:{value:t,message:C.toString(n)}})}nonempty(e){return this.min(1,e)}};A.create=(e,t)=>new A({type:e,minLength:null,maxLength:null,exactLength:null,typeName:K.ZodArray,...T(t)});function j(e){if(e instanceof M){let t={};for(let n in e.shape){let r=e.shape[n];t[n]=V.create(j(r))}return new M({...e._def,shape:()=>t})}return e instanceof A?new A({...e._def,type:j(e.element)}):e instanceof V?V.create(j(e.unwrap())):e instanceof H?H.create(j(e.unwrap())):e instanceof I?I.create(e.items.map(e=>j(e))):e}var M=class e extends E{constructor(){super(...arguments),this._cached=null,this.nonstrict=this.passthrough,this.augment=this.extend}_getCached(){if(this._cached!==null)return this._cached;let e=this._def.shape(),t=o.objectKeys(e);return this._cached={shape:e,keys:t},this._cached}_parse(e){if(this._getType(e)!==c.object){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.object,received:t.parsedType}),v}let{status:t,ctx:n}=this._processInputParams(e),{shape:r,keys:i}=this._getCached(),a=[];if(!(this._def.catchall instanceof k&&this._def.unknownKeys===`strip`))for(let e in n.data)i.includes(e)||a.push(e);let o=[];for(let e of i){let t=r[e],i=n.data[e];o.push({key:{status:`valid`,value:e},value:t._parse(new w(n,i,n.path,e)),alwaysSet:e in n.data})}if(this._def.catchall instanceof k){let e=this._def.unknownKeys;if(e===`passthrough`)for(let e of a)o.push({key:{status:`valid`,value:e},value:{status:`valid`,value:n.data[e]}});else if(e===`strict`)a.length>0&&(g(n,{code:u.unrecognized_keys,keys:a}),t.dirty());else if(e!==`strip`)throw Error(`Internal ZodObject error: invalid unknownKeys value.`)}else{let e=this._def.catchall;for(let t of a){let r=n.data[t];o.push({key:{status:`valid`,value:t},value:e._parse(new w(n,r,n.path,t)),alwaysSet:t in n.data})}}return n.common.async?Promise.resolve().then(async()=>{let e=[];for(let t of o){let n=await t.key,r=await t.value;e.push({key:n,value:r,alwaysSet:t.alwaysSet})}return e}).then(e=>_.mergeObjectSync(t,e)):_.mergeObjectSync(t,o)}get shape(){return this._def.shape()}strict(t){return C.errToObj,new e({...this._def,unknownKeys:`strict`,...t===void 0?{}:{errorMap:(e,n)=>{let r=this._def.errorMap?.(e,n).message??n.defaultError;return e.code===`unrecognized_keys`?{message:C.errToObj(t).message??r}:{message:r}}}})}strip(){return new e({...this._def,unknownKeys:`strip`})}passthrough(){return new e({...this._def,unknownKeys:`passthrough`})}extend(t){return new e({...this._def,shape:()=>({...this._def.shape(),...t})})}merge(t){return new e({unknownKeys:t._def.unknownKeys,catchall:t._def.catchall,shape:()=>({...this._def.shape(),...t._def.shape()}),typeName:K.ZodObject})}setKey(e,t){return this.augment({[e]:t})}catchall(t){return new e({...this._def,catchall:t})}pick(t){let n={};for(let e of o.objectKeys(t))t[e]&&this.shape[e]&&(n[e]=this.shape[e]);return new e({...this._def,shape:()=>n})}omit(t){let n={};for(let e of o.objectKeys(this.shape))t[e]||(n[e]=this.shape[e]);return new e({...this._def,shape:()=>n})}deepPartial(){return j(this)}partial(t){let n={};for(let e of o.objectKeys(this.shape)){let r=this.shape[e];n[e]=t&&!t[e]?r:r.optional()}return new e({...this._def,shape:()=>n})}required(t){let n={};for(let e of o.objectKeys(this.shape))if(t&&!t[e])n[e]=this.shape[e];else{let t=this.shape[e];for(;t instanceof V;)t=t._def.innerType;n[e]=t}return new e({...this._def,shape:()=>n})}keyof(){return Ue(o.objectKeys(this.shape))}};M.create=(e,t)=>new M({shape:()=>e,unknownKeys:`strip`,catchall:k.create(),typeName:K.ZodObject,...T(t)}),M.strictCreate=(e,t)=>new M({shape:()=>e,unknownKeys:`strict`,catchall:k.create(),typeName:K.ZodObject,...T(t)}),M.lazycreate=(e,t)=>new M({shape:e,unknownKeys:`strip`,catchall:k.create(),typeName:K.ZodObject,...T(t)});var N=class extends E{_parse(e){let{ctx:t}=this._processInputParams(e),n=this._def.options;function r(e){for(let t of e)if(t.result.status===`valid`)return t.result;for(let n of e)if(n.result.status===`dirty`)return t.common.issues.push(...n.ctx.common.issues),n.result;let n=e.map(e=>new d(e.ctx.common.issues));return g(t,{code:u.invalid_union,unionErrors:n}),v}if(t.common.async)return Promise.all(n.map(async e=>{let n={...t,common:{...t.common,issues:[]},parent:null};return{result:await e._parseAsync({data:t.data,path:t.path,parent:n}),ctx:n}})).then(r);{let e,r=[];for(let i of n){let n={...t,common:{...t.common,issues:[]},parent:null},a=i._parseSync({data:t.data,path:t.path,parent:n});if(a.status===`valid`)return a;a.status===`dirty`&&!e&&(e={result:a,ctx:n}),n.common.issues.length&&r.push(n.common.issues)}if(e)return t.common.issues.push(...e.ctx.common.issues),e.result;let i=r.map(e=>new d(e));return g(t,{code:u.invalid_union,unionErrors:i}),v}}get options(){return this._def.options}};N.create=(e,t)=>new N({options:e,typeName:K.ZodUnion,...T(t)});var P=e=>e instanceof L?P(e.schema):e instanceof B?P(e.innerType()):e instanceof R?[e.value]:e instanceof We?e.options:e instanceof Ge?o.objectValues(e.enum):e instanceof U?P(e._def.innerType):e instanceof Ne?[void 0]:e instanceof Pe?[null]:e instanceof V?[void 0,...P(e.unwrap())]:e instanceof H?[null,...P(e.unwrap())]:e instanceof qe||e instanceof G?P(e.unwrap()):e instanceof W?P(e._def.innerType):[],Le=class e extends E{_parse(e){let{ctx:t}=this._processInputParams(e);if(t.parsedType!==c.object)return g(t,{code:u.invalid_type,expected:c.object,received:t.parsedType}),v;let n=this.discriminator,r=t.data[n],i=this.optionsMap.get(r);return i?t.common.async?i._parseAsync({data:t.data,path:t.path,parent:t}):i._parseSync({data:t.data,path:t.path,parent:t}):(g(t,{code:u.invalid_union_discriminator,options:Array.from(this.optionsMap.keys()),path:[n]}),v)}get discriminator(){return this._def.discriminator}get options(){return this._def.options}get optionsMap(){return this._def.optionsMap}static create(t,n,r){let i=new Map;for(let e of n){let n=P(e.shape[t]);if(!n.length)throw Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);for(let r of n){if(i.has(r))throw Error(`Discriminator property ${String(t)} has duplicate value ${String(r)}`);i.set(r,e)}}return new e({typeName:K.ZodDiscriminatedUnion,discriminator:t,options:n,optionsMap:i,...T(r)})}};function Re(e,t){let n=l(e),r=l(t);if(e===t)return{valid:!0,data:e};if(n===c.object&&r===c.object){let n=o.objectKeys(t),r=o.objectKeys(e).filter(e=>n.indexOf(e)!==-1),i={...e,...t};for(let n of r){let r=Re(e[n],t[n]);if(!r.valid)return{valid:!1};i[n]=r.data}return{valid:!0,data:i}}if(n===c.array&&r===c.array){if(e.length!==t.length)return{valid:!1};let n=[];for(let r=0;r<e.length;r++){let i=e[r],a=t[r],o=Re(i,a);if(!o.valid)return{valid:!1};n.push(o.data)}return{valid:!0,data:n}}return n===c.date&&r===c.date&&+e==+t?{valid:!0,data:e}:{valid:!1}}var F=class extends E{_parse(e){let{status:t,ctx:n}=this._processInputParams(e),r=(e,r)=>{if(ee(e)||ee(r))return v;let i=Re(e.value,r.value);return i.valid?((te(e)||te(r))&&t.dirty(),{status:t.value,value:i.data}):(g(n,{code:u.invalid_intersection_types}),v)};return n.common.async?Promise.all([this._def.left._parseAsync({data:n.data,path:n.path,parent:n}),this._def.right._parseAsync({data:n.data,path:n.path,parent:n})]).then(([e,t])=>r(e,t)):r(this._def.left._parseSync({data:n.data,path:n.path,parent:n}),this._def.right._parseSync({data:n.data,path:n.path,parent:n}))}};F.create=(e,t,n)=>new F({left:e,right:t,typeName:K.ZodIntersection,...T(n)});var I=class e extends E{_parse(e){let{status:t,ctx:n}=this._processInputParams(e);if(n.parsedType!==c.array)return g(n,{code:u.invalid_type,expected:c.array,received:n.parsedType}),v;if(n.data.length<this._def.items.length)return g(n,{code:u.too_small,minimum:this._def.items.length,inclusive:!0,exact:!1,type:`array`}),v;!this._def.rest&&n.data.length>this._def.items.length&&(g(n,{code:u.too_big,maximum:this._def.items.length,inclusive:!0,exact:!1,type:`array`}),t.dirty());let r=[...n.data].map((e,t)=>{let r=this._def.items[t]||this._def.rest;return r?r._parse(new w(n,e,n.path,t)):null}).filter(e=>!!e);return n.common.async?Promise.all(r).then(e=>_.mergeArray(t,e)):_.mergeArray(t,r)}get items(){return this._def.items}rest(t){return new e({...this._def,rest:t})}};I.create=(e,t)=>{if(!Array.isArray(e))throw Error(`You must pass an array of schemas to z.tuple([ ... ])`);return new I({items:e,typeName:K.ZodTuple,rest:null,...T(t)})};var ze=class e extends E{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){let{status:t,ctx:n}=this._processInputParams(e);if(n.parsedType!==c.object)return g(n,{code:u.invalid_type,expected:c.object,received:n.parsedType}),v;let r=[],i=this._def.keyType,a=this._def.valueType;for(let e in n.data)r.push({key:i._parse(new w(n,e,n.path,e)),value:a._parse(new w(n,n.data[e],n.path,e)),alwaysSet:e in n.data});return n.common.async?_.mergeObjectAsync(t,r):_.mergeObjectSync(t,r)}get element(){return this._def.valueType}static create(t,n,r){return n instanceof E?new e({keyType:t,valueType:n,typeName:K.ZodRecord,...T(r)}):new e({keyType:D.create(),valueType:t,typeName:K.ZodRecord,...T(n)})}},Be=class extends E{get keySchema(){return this._def.keyType}get valueSchema(){return this._def.valueType}_parse(e){let{status:t,ctx:n}=this._processInputParams(e);if(n.parsedType!==c.map)return g(n,{code:u.invalid_type,expected:c.map,received:n.parsedType}),v;let r=this._def.keyType,i=this._def.valueType,a=[...n.data.entries()].map(([e,t],a)=>({key:r._parse(new w(n,e,n.path,[a,`key`])),value:i._parse(new w(n,t,n.path,[a,`value`]))}));if(n.common.async){let e=new Map;return Promise.resolve().then(async()=>{for(let n of a){let r=await n.key,i=await n.value;if(r.status===`aborted`||i.status===`aborted`)return v;(r.status===`dirty`||i.status===`dirty`)&&t.dirty(),e.set(r.value,i.value)}return{status:t.value,value:e}})}{let e=new Map;for(let n of a){let r=n.key,i=n.value;if(r.status===`aborted`||i.status===`aborted`)return v;(r.status===`dirty`||i.status===`dirty`)&&t.dirty(),e.set(r.value,i.value)}return{status:t.value,value:e}}}};Be.create=(e,t,n)=>new Be({valueType:t,keyType:e,typeName:K.ZodMap,...T(n)});var Ve=class e extends E{_parse(e){let{status:t,ctx:n}=this._processInputParams(e);if(n.parsedType!==c.set)return g(n,{code:u.invalid_type,expected:c.set,received:n.parsedType}),v;let r=this._def;r.minSize!==null&&n.data.size<r.minSize.value&&(g(n,{code:u.too_small,minimum:r.minSize.value,type:`set`,inclusive:!0,exact:!1,message:r.minSize.message}),t.dirty()),r.maxSize!==null&&n.data.size>r.maxSize.value&&(g(n,{code:u.too_big,maximum:r.maxSize.value,type:`set`,inclusive:!0,exact:!1,message:r.maxSize.message}),t.dirty());let i=this._def.valueType;function a(e){let n=new Set;for(let r of e){if(r.status===`aborted`)return v;r.status===`dirty`&&t.dirty(),n.add(r.value)}return{status:t.value,value:n}}let o=[...n.data.values()].map((e,t)=>i._parse(new w(n,e,n.path,t)));return n.common.async?Promise.all(o).then(e=>a(e)):a(o)}min(t,n){return new e({...this._def,minSize:{value:t,message:C.toString(n)}})}max(t,n){return new e({...this._def,maxSize:{value:t,message:C.toString(n)}})}size(e,t){return this.min(e,t).max(e,t)}nonempty(e){return this.min(1,e)}};Ve.create=(e,t)=>new Ve({valueType:e,minSize:null,maxSize:null,typeName:K.ZodSet,...T(t)});var He=class e extends E{constructor(){super(...arguments),this.validate=this.implement}_parse(e){let{ctx:t}=this._processInputParams(e);if(t.parsedType!==c.function)return g(t,{code:u.invalid_type,expected:c.function,received:t.parsedType}),v;function n(e,n){return h({data:e,path:t.path,errorMaps:[t.common.contextualErrorMap,t.schemaErrorMap,m(),f].filter(e=>!!e),issueData:{code:u.invalid_arguments,argumentsError:n}})}function r(e,n){return h({data:e,path:t.path,errorMaps:[t.common.contextualErrorMap,t.schemaErrorMap,m(),f].filter(e=>!!e),issueData:{code:u.invalid_return_type,returnTypeError:n}})}let i={errorMap:t.common.contextualErrorMap},a=t.data;if(this._def.returns instanceof z){let e=this;return b(async function(...t){let o=new d([]),s=await e._def.args.parseAsync(t,i).catch(e=>{throw o.addIssue(n(t,e)),o}),c=await Reflect.apply(a,this,s);return await e._def.returns._def.type.parseAsync(c,i).catch(e=>{throw o.addIssue(r(c,e)),o})})}{let e=this;return b(function(...t){let o=e._def.args.safeParse(t,i);if(!o.success)throw new d([n(t,o.error)]);let s=Reflect.apply(a,this,o.data),c=e._def.returns.safeParse(s,i);if(!c.success)throw new d([r(s,c.error)]);return c.data})}}parameters(){return this._def.args}returnType(){return this._def.returns}args(...t){return new e({...this._def,args:I.create(t).rest(O.create())})}returns(t){return new e({...this._def,returns:t})}implement(e){return this.parse(e)}strictImplement(e){return this.parse(e)}static create(t,n,r){return new e({args:t||I.create([]).rest(O.create()),returns:n||O.create(),typeName:K.ZodFunction,...T(r)})}},L=class extends E{get schema(){return this._def.getter()}_parse(e){let{ctx:t}=this._processInputParams(e);return this._def.getter()._parse({data:t.data,path:t.path,parent:t})}};L.create=(e,t)=>new L({getter:e,typeName:K.ZodLazy,...T(t)});var R=class extends E{_parse(e){if(e.data!==this._def.value){let t=this._getOrReturnCtx(e);return g(t,{received:t.data,code:u.invalid_literal,expected:this._def.value}),v}return{status:`valid`,value:e.data}}get value(){return this._def.value}};R.create=(e,t)=>new R({value:e,typeName:K.ZodLiteral,...T(t)});function Ue(e,t){return new We({values:e,typeName:K.ZodEnum,...T(t)})}var We=class e extends E{_parse(e){if(typeof e.data!=`string`){let t=this._getOrReturnCtx(e),n=this._def.values;return g(t,{expected:o.joinValues(n),received:t.parsedType,code:u.invalid_type}),v}if(this._cache||=new Set(this._def.values),!this._cache.has(e.data)){let t=this._getOrReturnCtx(e),n=this._def.values;return g(t,{received:t.data,code:u.invalid_enum_value,options:n}),v}return b(e.data)}get options(){return this._def.values}get enum(){let e={};for(let t of this._def.values)e[t]=t;return e}get Values(){let e={};for(let t of this._def.values)e[t]=t;return e}get Enum(){let e={};for(let t of this._def.values)e[t]=t;return e}extract(t,n=this._def){return e.create(t,{...this._def,...n})}exclude(t,n=this._def){return e.create(this.options.filter(e=>!t.includes(e)),{...this._def,...n})}};We.create=Ue;var Ge=class extends E{_parse(e){let t=o.getValidEnumValues(this._def.values),n=this._getOrReturnCtx(e);if(n.parsedType!==c.string&&n.parsedType!==c.number){let e=o.objectValues(t);return g(n,{expected:o.joinValues(e),received:n.parsedType,code:u.invalid_type}),v}if(this._cache||=new Set(o.getValidEnumValues(this._def.values)),!this._cache.has(e.data)){let e=o.objectValues(t);return g(n,{received:n.data,code:u.invalid_enum_value,options:e}),v}return b(e.data)}get enum(){return this._def.values}};Ge.create=(e,t)=>new Ge({values:e,typeName:K.ZodNativeEnum,...T(t)});var z=class extends E{unwrap(){return this._def.type}_parse(e){let{ctx:t}=this._processInputParams(e);return t.parsedType!==c.promise&&t.common.async===!1?(g(t,{code:u.invalid_type,expected:c.promise,received:t.parsedType}),v):b((t.parsedType===c.promise?t.data:Promise.resolve(t.data)).then(e=>this._def.type.parseAsync(e,{path:t.path,errorMap:t.common.contextualErrorMap})))}};z.create=(e,t)=>new z({type:e,typeName:K.ZodPromise,...T(t)});var B=class extends E{innerType(){return this._def.schema}sourceType(){return this._def.schema._def.typeName===K.ZodEffects?this._def.schema.sourceType():this._def.schema}_parse(e){let{status:t,ctx:n}=this._processInputParams(e),r=this._def.effect||null,i={addIssue:e=>{g(n,e),e.fatal?t.abort():t.dirty()},get path(){return n.path}};if(i.addIssue=i.addIssue.bind(i),r.type===`preprocess`){let e=r.transform(n.data,i);if(n.common.async)return Promise.resolve(e).then(async e=>{if(t.value===`aborted`)return v;let r=await this._def.schema._parseAsync({data:e,path:n.path,parent:n});return r.status===`aborted`?v:r.status===`dirty`||t.value===`dirty`?y(r.value):r});{if(t.value===`aborted`)return v;let r=this._def.schema._parseSync({data:e,path:n.path,parent:n});return r.status===`aborted`?v:r.status===`dirty`||t.value===`dirty`?y(r.value):r}}if(r.type===`refinement`){let e=e=>{let t=r.refinement(e,i);if(n.common.async)return Promise.resolve(t);if(t instanceof Promise)throw Error(`Async refinement encountered during synchronous parse operation. Use .parseAsync instead.`);return e};if(n.common.async===!1){let r=this._def.schema._parseSync({data:n.data,path:n.path,parent:n});return r.status===`aborted`?v:(r.status===`dirty`&&t.dirty(),e(r.value),{status:t.value,value:r.value})}return this._def.schema._parseAsync({data:n.data,path:n.path,parent:n}).then(n=>n.status===`aborted`?v:(n.status===`dirty`&&t.dirty(),e(n.value).then(()=>({status:t.value,value:n.value}))))}if(r.type===`transform`){if(n.common.async===!1){let e=this._def.schema._parseSync({data:n.data,path:n.path,parent:n});if(!x(e))return v;let a=r.transform(e.value,i);if(a instanceof Promise)throw Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);return{status:t.value,value:a}}return this._def.schema._parseAsync({data:n.data,path:n.path,parent:n}).then(e=>x(e)?Promise.resolve(r.transform(e.value,i)).then(e=>({status:t.value,value:e})):v)}o.assertNever(r)}};B.create=(e,t,n)=>new B({schema:e,typeName:K.ZodEffects,effect:t,...T(n)}),B.createWithPreprocess=(e,t,n)=>new B({schema:t,effect:{type:`preprocess`,transform:e},typeName:K.ZodEffects,...T(n)});var V=class extends E{_parse(e){return this._getType(e)===c.undefined?b(void 0):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}};V.create=(e,t)=>new V({innerType:e,typeName:K.ZodOptional,...T(t)});var H=class extends E{_parse(e){return this._getType(e)===c.null?b(null):this._def.innerType._parse(e)}unwrap(){return this._def.innerType}};H.create=(e,t)=>new H({innerType:e,typeName:K.ZodNullable,...T(t)});var U=class extends E{_parse(e){let{ctx:t}=this._processInputParams(e),n=t.data;return t.parsedType===c.undefined&&(n=this._def.defaultValue()),this._def.innerType._parse({data:n,path:t.path,parent:t})}removeDefault(){return this._def.innerType}};U.create=(e,t)=>new U({innerType:e,typeName:K.ZodDefault,defaultValue:typeof t.default==`function`?t.default:()=>t.default,...T(t)});var W=class extends E{_parse(e){let{ctx:t}=this._processInputParams(e),n={...t,common:{...t.common,issues:[]}},r=this._def.innerType._parse({data:n.data,path:n.path,parent:{...n}});return S(r)?r.then(e=>({status:`valid`,value:e.status===`valid`?e.value:this._def.catchValue({get error(){return new d(n.common.issues)},input:n.data})})):{status:`valid`,value:r.status===`valid`?r.value:this._def.catchValue({get error(){return new d(n.common.issues)},input:n.data})}}removeCatch(){return this._def.innerType}};W.create=(e,t)=>new W({innerType:e,typeName:K.ZodCatch,catchValue:typeof t.catch==`function`?t.catch:()=>t.catch,...T(t)});var Ke=class extends E{_parse(e){if(this._getType(e)!==c.nan){let t=this._getOrReturnCtx(e);return g(t,{code:u.invalid_type,expected:c.nan,received:t.parsedType}),v}return{status:`valid`,value:e.data}}};Ke.create=e=>new Ke({typeName:K.ZodNaN,...T(e)});var qe=class extends E{_parse(e){let{ctx:t}=this._processInputParams(e),n=t.data;return this._def.type._parse({data:n,path:t.path,parent:t})}unwrap(){return this._def.type}},Je=class e extends E{_parse(e){let{status:t,ctx:n}=this._processInputParams(e);if(n.common.async)return(async()=>{let e=await this._def.in._parseAsync({data:n.data,path:n.path,parent:n});return e.status===`aborted`?v:e.status===`dirty`?(t.dirty(),y(e.value)):this._def.out._parseAsync({data:e.value,path:n.path,parent:n})})();{let e=this._def.in._parseSync({data:n.data,path:n.path,parent:n});return e.status===`aborted`?v:e.status===`dirty`?(t.dirty(),{status:`dirty`,value:e.value}):this._def.out._parseSync({data:e.value,path:n.path,parent:n})}}static create(t,n){return new e({in:t,out:n,typeName:K.ZodPipeline})}},G=class extends E{_parse(e){let t=this._def.innerType._parse(e),n=e=>(x(e)&&(e.value=Object.freeze(e.value)),e);return S(t)?t.then(e=>n(e)):n(t)}unwrap(){return this._def.innerType}};G.create=(e,t)=>new G({innerType:e,typeName:K.ZodReadonly,...T(t)}),M.lazycreate;var K;(function(e){e.ZodString=`ZodString`,e.ZodNumber=`ZodNumber`,e.ZodNaN=`ZodNaN`,e.ZodBigInt=`ZodBigInt`,e.ZodBoolean=`ZodBoolean`,e.ZodDate=`ZodDate`,e.ZodSymbol=`ZodSymbol`,e.ZodUndefined=`ZodUndefined`,e.ZodNull=`ZodNull`,e.ZodAny=`ZodAny`,e.ZodUnknown=`ZodUnknown`,e.ZodNever=`ZodNever`,e.ZodVoid=`ZodVoid`,e.ZodArray=`ZodArray`,e.ZodObject=`ZodObject`,e.ZodUnion=`ZodUnion`,e.ZodDiscriminatedUnion=`ZodDiscriminatedUnion`,e.ZodIntersection=`ZodIntersection`,e.ZodTuple=`ZodTuple`,e.ZodRecord=`ZodRecord`,e.ZodMap=`ZodMap`,e.ZodSet=`ZodSet`,e.ZodFunction=`ZodFunction`,e.ZodLazy=`ZodLazy`,e.ZodLiteral=`ZodLiteral`,e.ZodEnum=`ZodEnum`,e.ZodEffects=`ZodEffects`,e.ZodNativeEnum=`ZodNativeEnum`,e.ZodOptional=`ZodOptional`,e.ZodNullable=`ZodNullable`,e.ZodDefault=`ZodDefault`,e.ZodCatch=`ZodCatch`,e.ZodPromise=`ZodPromise`,e.ZodBranded=`ZodBranded`,e.ZodPipeline=`ZodPipeline`,e.ZodReadonly=`ZodReadonly`})(K||={});var q=D.create,Ye=Oe.create;Ke.create,ke.create;var J=Ae.create;je.create,Me.create,Ne.create,Pe.create,Fe.create,O.create,k.create,Ie.create;var Y=A.create,X=M.create;M.strictCreate,N.create,Le.create,F.create,I.create,ze.create,Be.create,Ve.create,He.create,L.create,R.create;var Xe=We.create;Ge.create,z.create,B.create,V.create,H.create,B.createWithPreprocess,Je.create;var Ze=Xe([`bevestigd`,`ontkracht`,`tegenspraak`,`gemengd_of_context`,`opinie`]),Qe=X({quote:q().describe(`Letterlijk citaat of kernuitspraak uit de video`),startSeconds:Ye().describe(`Tijdstip in seconden in de video`),timestampLabel:q().describe(`Geformatteerde tijdcode [mm:ss]`),claim:q().describe(`De feitelijke claim of stelling die gedaan wordt`),verdict:Ze,historicalAnalysis:q().describe(`Korte historische en feitelijke analyse die de claim bevestigt of ontkracht`),sources:Y(X({title:q(),url:q()})).optional()}),$e=X({coreActivity:q().describe(`De kern van de activiteit en daadwerkelijke handeling in of rondom de video`),sentimentAndAttitude:q().describe(`Boodschap, toon en de houding ten opzichte van de naaste of tegenstander`),contradictionsDetected:Y(q()).describe(`Gedetecteerde zelf-tegenspraak tussen woorden en daden of interne tegenspraak`),statements:Y(Qe).min(1)}),et=X({guidelineId:q().describe(`Het exacte ID van de relevante richtlijn uit de database`),score:Ye().min(0).max(10).describe(`Score van 0 t/m 10 voor deze richtlijn`),reasoning:q().describe(`Grondige onderbouwing die de video-uitspraak, de factcheck en Jezus' onderwijs verbindt`),relatedQuotes:Y(X({quote:q(),startSeconds:Ye(),timestampLabel:q()}))});X({verdictSummary:q().describe(`Samenvattende eindconclusie: wat zou Jezus van deze video vinden?`),factcheckDossier:$e,relevantGuidelines:Y(et).min(1)});var tt=X({actief:J().catch(!0),provider:Xe([`claude`,`gemini`]).catch(`gemini`),models:X({claude:q().min(1).catch(a.claude),gemini:q().min(1).catch(a.gemini)}).catch({...a}),googleFactCheckActief:J().catch(!0),automatisch:J().catch(!0),taal:q().min(2).catch(`nl`),debugLog:J().catch(!1),paneelIngeklapt:J().catch(!1)}),nt=tt.parse({});function rt(e){return tt.parse(e&&typeof e==`object`?e:{})}var it=`
:host {
  all: initial;
  --yt-bg: #ffffff;
  --yt-card: rgba(0, 0, 0, 0.05);
  --yt-card-hover: rgba(0, 0, 0, 0.08);
  --yt-text: #0f0f0f;
  --yt-text-2: #606060;
  --yt-border: rgba(0, 0, 0, 0.1);
  --yt-accent: #065fd4;
  --yt-accent-bg: #def1ff;
  --yt-green: #137333;
  --yt-green-bg: #e6f4ea;
  --yt-amber: #b05a00;
  --yt-amber-bg: #fef7e0;
  --yt-red: #c5221f;
  --yt-red-bg: #fce8e6;
  --yt-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  font-family: "Roboto", "Arial", sans-serif;
  color: var(--yt-text);
  font-size: 14px;
  line-height: 20px;
}
:host([data-theme="dark"]) {
  --yt-bg: #212121;
  --yt-card: rgba(255, 255, 255, 0.08);
  --yt-card-hover: rgba(255, 255, 255, 0.14);
  --yt-text: #f1f1f1;
  --yt-text-2: #aaaaaa;
  --yt-border: rgba(255, 255, 255, 0.15);
  --yt-accent: #3ea6ff;
  --yt-accent-bg: #263850;
  --yt-green: #81c995;
  --yt-green-bg: #133924;
  --yt-amber: #fdd663;
  --yt-amber-bg: #3d2e14;
  --yt-red: #f28b82;
  --yt-red-bg: #441b18;
  --yt-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
}
* { box-sizing: border-box; }
button { font: inherit; color: inherit; cursor: pointer; }
a { color: var(--yt-accent); text-decoration: none; }
a:hover { text-decoration: underline; }

.wwjd-card {
  background: var(--yt-card);
  border: 1px solid var(--yt-border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wwjd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.wwjd-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-btn {
  background: transparent;
  border: 0;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--yt-text);
  flex: none;
}

.icon-btn:hover {
  background: var(--yt-card-hover);
}

.icon-btn svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.switch {
  position: relative;
  flex: none;
  width: 36px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: #909090;
  cursor: pointer;
  transition: background 0.15s;
}

.switch .knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transition: left 0.15s;
}

.switch[aria-checked="true"] {
  background: var(--yt-accent);
}

.switch[aria-checked="true"] .knob {
  left: 18px;
}

.off {
  margin: 4px 0 0;
  color: var(--yt-text-2);
  font-size: 13px;
}

.btn {
  background: var(--yt-card-hover);
  border: 0;
  border-radius: 18px;
  padding: 0 14px;
  height: 32px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn:hover {
  background: var(--yt-border);
}

.btn.primary {
  background: var(--yt-text);
  color: var(--yt-bg);
}

.btn.primary:hover {
  opacity: 0.85;
}

.btn svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.loading {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.loading .step {
  color: var(--yt-text-2);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--yt-border);
  border-top-color: var(--yt-accent);
  animation: spin 0.8s linear infinite;
  flex: none;
}

.bar {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--yt-card) 0%, var(--yt-card-hover) 50%, var(--yt-card) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

.bar.w80 { width: 80%; }
.bar.w60 { width: 60%; }
.bar.w90 { width: 90%; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.error-msg {
  margin-top: 4px;
  color: var(--yt-text);
}

.error-msg::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--yt-red);
  margin-right: 8px;
  vertical-align: 1px;
}

.meta {
  margin-top: 10px;
  font-size: 12px;
  color: var(--yt-text-2);
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
}

.wwjd-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wwjd-brand .logo-badge {
  background: var(--yt-accent);
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.wwjd-brand .title {
  font-size: 16px;
  font-weight: 600;
  color: var(--yt-text);
}

.wwjd-score-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid transparent;
}

.wwjd-score-banner.score-high {
  background: var(--yt-green-bg);
  border-color: var(--yt-green);
  color: var(--yt-green);
}

.wwjd-score-banner.score-mid {
  background: var(--yt-amber-bg);
  border-color: var(--yt-amber);
  color: var(--yt-amber);
}

.wwjd-score-banner.score-low {
  background: var(--yt-red-bg);
  border-color: var(--yt-red);
  color: var(--yt-red);
}

.wwjd-score-number {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
}

.wwjd-score-details {
  flex: 1;
  color: var(--yt-text);
  font-size: 13px;
  line-height: 18px;
}

.wwjd-score-details strong {
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
}

.toggle-details-btn {
  background: var(--yt-card-hover);
  border: 0;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--yt-text);
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-details-btn:hover {
  background: var(--yt-border);
}

/* Factcheck Dossier (Activiteit 1) */
.section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--yt-text-2);
  margin-top: 8px;
}

.activity-summary {
  font-size: 13px;
  background: var(--yt-card);
  padding: 10px 12px;
  border-radius: 6px;
  border-left: 3px solid var(--yt-accent);
}

.contradiction-alert {
  background: var(--yt-red-bg);
  color: var(--yt-red);
  border: 1px solid var(--yt-red);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.statement-item {
  background: var(--yt-card);
  border-radius: 8px;
  padding: 10px 12px;
  margin-top: 6px;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.statement-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.time-btn {
  background: var(--yt-accent-bg);
  color: var(--yt-accent);
  border: 0;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  font-family: monospace;
}

.time-btn:hover {
  filter: brightness(0.9);
}

.verdict-tag {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
}

.verdict-tag.bevestigd {
  background: var(--yt-green-bg);
  color: var(--yt-green);
}

.verdict-tag.ontkracht {
  background: var(--yt-red-bg);
  color: var(--yt-red);
}

.verdict-tag.tegenspraak {
  background: var(--yt-red-bg);
  color: var(--yt-red);
}

.verdict-tag.gemengd_of_context {
  background: var(--yt-amber-bg);
  color: var(--yt-amber);
}

.verdict-tag.opinie {
  background: var(--yt-card-hover);
  color: var(--yt-text-2);
}

/* Guideline Items (Activiteit 2) */
.guideline-card {
  background: var(--yt-card);
  border: 1px solid var(--yt-border);
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.guideline-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.guideline-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--yt-text);
}

.guideline-score {
  font-weight: 800;
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 4px;
}

.guideline-reasoning {
  font-size: 13px;
  line-height: 18px;
  color: var(--yt-text);
}

.bible-sources-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.bible-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--yt-accent-bg);
  color: var(--yt-accent);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.bible-badge:hover {
  filter: brightness(0.95);
  text-decoration: none;
}
`,at={info:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>`,logo:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z"/></svg>`,refresh:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,chevronUp:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`,chevronDown:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`,close:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,warn:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,settings:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14 12.94a7.3 7.3 0 0 0 0-1.88l2.03-1.58-1.92-3.32-2.39.96a7 7 0 0 0-1.63-.94L14.87 3.6h-3.84l-.36 2.58c-.59.24-1.13.56-1.63.94l-2.39-.96-1.92 3.32 2.03 1.58a7.3 7.3 0 0 0 0 1.88l-2.03 1.58 1.92 3.32 2.39-.96c.5.38 1.04.7 1.63.94l.36 2.58h3.84l.36-2.58c.59-.24 1.13-.56 1.63-.94l2.39.96 1.92-3.32-2.03-1.58zM12.95 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>`};function Z(e,t={},...n){let r=document.createElement(e);for(let[e,n]of Object.entries(t))n!=null&&n!==!1&&(e===`class`?r.className=String(n):e.startsWith(`on`)&&typeof n==`function`?r.addEventListener(e.slice(2).toLowerCase(),n):e===`html`?r.innerHTML=String(n):r.setAttribute(e,n===!0?``:String(n)));for(let e of n)e!=null&&e!==!1&&r.append(e);return r}function Q(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function ot(e,t,n={}){e.innerHTML=``;let r=document.createElement(`style`);r.textContent=it,e.appendChild(r);let i=document.createElement(`div`);i.className=`wwjd-card`;let a=`score-mid`;t.finalScore>=7?a=`score-high`:t.finalScore<4&&(a=`score-low`);let o=document.createElement(`div`);o.className=`wwjd-header`;let s=Z(`div`,{class:`wwjd-brand`},Z(`span`,{class:`logo-badge`},`WWJD`),Z(`span`,{class:`title`},`What Would Jezus Do`)),c=Z(`div`,{class:`wwjd-header-actions`});if(n.onToggleEnabled){let e=n.enabled!==!1;c.append(Z(`button`,{type:`button`,class:`switch`,role:`switch`,"aria-checked":String(e),"aria-label":`What Would Jezus Do aan of uit`,title:e?`WWJD uitzetten`:`WWJD aanzetten`,onClick:()=>n.onToggleEnabled?.(!e)},Z(`span`,{class:`knob`})))}n.onRefresh&&c.append(Z(`button`,{type:`button`,class:`icon-btn`,title:`Opnieuw analyseren`,"aria-label":`Opnieuw analyseren`,html:at.refresh,onClick:n.onRefresh})),n.onOpenOptions&&c.append(Z(`button`,{type:`button`,class:`icon-btn`,title:`Instellingen`,"aria-label":`Instellingen`,html:at.settings,onClick:n.onOpenOptions}));let l=Z(`button`,{type:`button`,class:`toggle-details-btn`,id:`wwjd-toggle-btn`},n.initiallyCollapsed?`Toon onderbouwing ▼`:`Onderbouwing inklappen ▲`);c.append(l),o.append(s,c),i.appendChild(o);let u=document.createElement(`div`);u.className=`wwjd-score-banner ${a}`,u.innerHTML=`
    <div class="wwjd-score-number">${t.finalScore.toFixed(1)}</div>
    <div class="wwjd-score-details">
      <strong>Jezus-overeenkomst: ${t.finalScore.toFixed(1)} / 10</strong>
      ${Q(t.verdictSummary)}
    </div>
  `,i.appendChild(u);let d=document.createElement(`div`);d.id=`wwjd-details-body`,n.initiallyCollapsed&&(d.style.display=`none`);let f=document.createElement(`div`);if(f.innerHTML=`
    <div class="section-title">1. Factcheck & Integriteit (Activiteit 1)</div>
    <div class="activity-summary">
      <strong>Kern van activiteit:</strong> ${Q(t.factcheckDossier.coreActivity)}<br>
      <strong>Sentiment & houding:</strong> ${Q(t.factcheckDossier.sentimentAndAttitude)}
    </div>
  `,t.factcheckDossier.contradictionsDetected.length>0){let e=document.createElement(`div`);e.className=`contradiction-alert`,e.style.marginTop=`6px`,e.innerHTML=`
      ⚠️ <strong>Zelf-tegenspraak geconstateerd (= per definitie liegen):</strong><br>
      ${t.factcheckDossier.contradictionsDetected.map(e=>`• ${Q(e)}`).join(`<br>`)}
    `,f.appendChild(e)}t.factcheckDossier.statements.forEach(e=>{let t=document.createElement(`div`);t.className=`statement-item`,t.innerHTML=`
      <div class="statement-header">
        <button type="button" class="time-btn" data-start="${e.startSeconds}">
          ⏱️ ${Q(e.timestampLabel)}
        </button>
        <span class="verdict-tag ${e.verdict}">${e.verdict.replace(/_/g,` `)}</span>
      </div>
      <div><strong>Uitspraak:</strong> "${Q(e.quote)}"</div>
      <div><strong>Factcheck:</strong> ${Q(e.historicalAnalysis)}</div>
      ${e.sources&&e.sources.length>0?`<div><small>Bron(nen): ${e.sources.map(e=>`<a href="${Q(e.url)}" target="_blank" rel="noopener noreferrer">${Q(e.title||e.url)}</a>`).join(`, `)}</small></div>`:``}
    `,f.appendChild(t)}),d.appendChild(f);let p=document.createElement(`div`);p.style.marginTop=`14px`,p.innerHTML=`
    <div class="section-title">2. Toetsing aan Jezus' Richtlijnen (${t.relevantGuidelines.length} relevante punten meegewogen)</div>
  `,t.relevantGuidelines.forEach(e=>{let t=document.createElement(`div`);t.className=`guideline-card`;let n=`score-mid`;e.score>=7?n=`score-high`:e.score<4&&(n=`score-low`),t.innerHTML=`
      <div class="guideline-head">
        <div class="guideline-title">#${e.number} ${Q(e.title)}</div>
        <div class="guideline-score ${n}">${e.score.toFixed(1)} / 10</div>
      </div>
      <div class="guideline-reasoning">${Q(e.reasoning)}</div>
      ${e.relatedQuotes.length>0?`<div style="font-size: 12px; color: var(--yt-text-2);">
              Gekoppeld aan moment: ${e.relatedQuotes.map(e=>`<button type="button" class="time-btn" data-start="${e.startSeconds}">${Q(e.timestampLabel)}</button> "${Q(e.quote)}"`).join(`; `)}
            </div>`:``}
      <div class="bible-sources-list">
        ${e.bibleSources.map(e=>`
          <a class="bible-badge" href="${Q(e.url)}" target="_blank" rel="noopener noreferrer" title="${Q(e.quote)}">
            📖 ${Q(e.reference)} ↗
          </a>
        `).join(``)}
      </div>
    `,p.appendChild(t)}),d.appendChild(p);let m=t.provider===`claude`?`Claude`:`Gemini`,h=new Date(t.createdAt),g=Number.isNaN(h.getTime())?``:n.fromCache?`Uit cache · ${h.toLocaleDateString(`nl-NL`)}`:`Zojuist geanalyseerd`;d.appendChild(Z(`div`,{class:`meta`},Z(`span`,{},`${m} · ${t.model}`),g?Z(`span`,{},g):null)),i.appendChild(d),e.appendChild(i);let _=e.querySelector(`#wwjd-toggle-btn`),v=!!n.initiallyCollapsed;_?.addEventListener(`click`,()=>{v=!v,d.style.display=v?`none`:`block`,_.textContent=v?`Toon onderbouwing ▼`:`Onderbouwing inklappen ▲`,n.onToggleCollapse?.(v)}),e.querySelectorAll(`.time-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=Number(e.getAttribute(`data-start`));!Number.isNaN(t)&&n.onSeek&&n.onSeek(t)})})}function st(e,t,n={},r={}){let i=r.enabled!==!1;if(i&&t.kind===`done`){ot(e,t.evaluation,{onSeek:n.onSeek,initiallyCollapsed:r.collapsed,onRefresh:n.onRefresh,onOpenOptions:n.onOpenOptions,onToggleCollapse:n.onToggleCollapse,onToggleEnabled:n.onToggleEnabled,enabled:i,fromCache:t.fromCache});return}e.innerHTML=``;let a=document.createElement(`style`);a.textContent=it,e.appendChild(a);let o=Z(`div`,{class:`wwjd-header-actions`});n.onToggleEnabled&&o.append(Z(`button`,{type:`button`,class:`switch`,role:`switch`,"aria-checked":String(i),"aria-label":`What Would Jezus Do aan of uit`,title:i?`WWJD uitzetten`:`WWJD aanzetten`,onClick:()=>n.onToggleEnabled?.(!i)},Z(`span`,{class:`knob`}))),n.onOpenOptions&&o.append(Z(`button`,{type:`button`,class:`icon-btn`,title:`Instellingen`,"aria-label":`Instellingen`,html:at.settings,onClick:n.onOpenOptions}));let s=Z(`div`,{class:`wwjd-card`,"aria-live":`polite`},Z(`div`,{class:`wwjd-header`},Z(`div`,{class:`wwjd-brand`},Z(`span`,{class:`logo-badge`},`WWJD`),Z(`span`,{class:`title`},`What Would Jezus Do`)),o));if(!i)s.append(Z(`p`,{class:`off`},`What Would Jezus Do staat uit: er worden geen analyses gemaakt.`)),e.appendChild(s);else{if(t.kind===`idle`)s.append(Z(`div`,{class:`actions`},Z(`button`,{type:`button`,class:`btn primary`,onClick:n.onStart},`Analyseer video`)));else if(t.kind===`loading`)s.append(Z(`div`,{class:`loading`,role:`status`},Z(`div`,{class:`step`},Z(`span`,{class:`spinner`}),t.step??`Video factchecken en toetsen aan Jezus' richtlijnen en De Tien Geboden…`),Z(`div`,{class:`bar w90`}),Z(`div`,{class:`bar w80`}),Z(`div`,{class:`bar w60`})));else if(t.kind===`error`){let e=Z(`div`,{class:`actions`});t.showSettings&&n.onOpenOptions&&e.append(Z(`button`,{type:`button`,class:`btn primary`,onClick:n.onOpenOptions},`Instellingen openen`)),n.onRefresh&&e.append(Z(`button`,{type:`button`,class:`btn`,onClick:n.onRefresh},`Opnieuw proberen`)),s.append(Z(`div`,{class:`error-msg`,role:`alert`},t.message),e)}e.appendChild(s)}}var $=`settings`;async function ct(){return rt((await t.storage.local.get($))[$])}async function lt(e){let n=rt({...await ct(),...e});return await t.storage.local.set({[$]:n}),n}function ut(e){let n=(t,n)=>{n===`local`&&t[$]&&e(rt(t[$].newValue))};return t.storage.onChanged.addListener(n),()=>t.storage.onChanged.removeListener(n)}var dt=e({matches:[`*://www.youtube.com/*`],runAt:`document_idle`,cssInjectionMode:`manual`,async main(e){console.log(`[wwjd] geladen`);let n=await ct().catch(()=>nt),r=null,a=``,o=null,s={kind:`idle`},c=n.paneelIngeklapt;function l(){return document.documentElement.hasAttribute(`dark`)?`dark`:`light`}function u(){o&&(o.dataset.theme=l())}let d=new MutationObserver(u);d.observe(document.documentElement,{attributes:!0,attributeFilter:[`dark`]});function f(){if(!o)return;let e=document.querySelector(`ytd-watch-flexy`)?.hasAttribute(`is-two-columns_`)??!0?document.querySelector(`ytd-watch-flexy #secondary-inner`)??document.querySelector(`ytd-watch-flexy #secondary`):document.querySelector(`ytd-watch-flexy #below`);if(!e)return;let t=e.querySelector(`:scope > #the-point-panel`);t?t.nextElementSibling!==o&&t.after(o):(o.parentElement!==e||e.firstElementChild!==o)&&e.prepend(o)}function p(){if(!o||!r)return;let e=r;st(o.shadowRoot??o.attachShadow({mode:`open`}),s,{onStart:()=>void g(e,!1),onRefresh:()=>void g(e,!0),onOpenOptions:()=>void t.runtime.sendMessage({type:`openOptions`}),onSeek:e=>_(e),onToggleCollapse:e=>{c=e,lt({paneelIngeklapt:e})},onToggleEnabled:t=>{n={...n,actief:t},lt({actief:t}),t&&s.kind===`idle`?g(e,!1):p()}},{collapsed:c,enabled:n.actief})}function m(){let e=window.location.pathname===`/watch`?i(window.location.href):null;e!==r&&(r=e,e?h(e):o&&=(o.remove(),null))}async function h(e){if(!await v([`ytd-watch-flexy #secondary-inner`,`ytd-watch-flexy #secondary`,`ytd-watch-flexy #below`])||r!==e)return;if(!o){o=document.createElement(`div`),o.id=`wwjd-root`,o.style.display=`block`,o.style.marginBottom=`16px`;for(let e of[`keydown`,`keyup`,`keypress`])o.addEventListener(e,e=>e.stopPropagation())}u(),f(),c=n.paneelIngeklapt;let i=await t.runtime.sendMessage({type:`getCached`,videoId:e}).catch(()=>null);r===e&&(i?.ok&&i.data?(s={kind:`done`,evaluation:i.data,fromCache:!0},p()):!n.actief||!n.automatisch?(s={kind:`idle`},p()):await g(e,!1))}async function g(e,n){s={kind:`loading`,step:`Video factchecken en toetsen aan Jezus' richtlijnen en De Tien Geboden…`},p();try{let i=await t.runtime.sendMessage({type:`evaluate`,videoId:e,force:n});if(r!==e)return;if(!i?.ok||!i.data){let e=i?.error??`Onbekende fout bij evaluatie.`;s={kind:`error`,message:e,showSettings:/sleutel|instellingen|toegang/i.test(e)},p();return}s={kind:`done`,evaluation:i.data,fromCache:!1},p()}catch(t){if(r===e){let e=t.message;s={kind:`error`,message:e,showSettings:/sleutel|instellingen|toegang/i.test(e)},p()}}}function _(e){let t=document.querySelector(`video`);t&&(t.currentTime=Math.max(0,e),t.play().catch(()=>{}))}function v(e){return new Promise(t=>{for(let n of e){let e=document.querySelector(n);if(e)return t(e)}let n=new MutationObserver(()=>{for(let r of e){let e=document.querySelector(r);if(e)return n.disconnect(),t(e)}});n.observe(document.documentElement,{childList:!0,subtree:!0}),setTimeout(()=>{n.disconnect(),t(null)},12e3)})}let y=ut(e=>{let t=e.actief!==n.actief,i=e.paneelIngeklapt!==n.paneelIngeklapt;n=e,i&&(c=e.paneelIngeklapt),t&&e.actief&&r&&s.kind===`idle`?g(r,!1):p()});document.addEventListener(`yt-navigate-finish`,m),window.addEventListener(`yt-navigate-finish`,m),window.addEventListener(`popstate`,m);let b=window.setInterval(()=>{window.location.href!==a&&(a=window.location.href,m()),r&&o&&!o.isConnected&&f()},1e3);e.onInvalidated(()=>{y(),d.disconnect(),window.clearInterval(b),document.removeEventListener(`yt-navigate-finish`,m),window.removeEventListener(`yt-navigate-finish`,m),window.removeEventListener(`popstate`,m),o?.remove()}),a=window.location.href,m()}}),ft={debug:(...e)=>([...e],void 0),log:(...e)=>([...e],void 0),warn:(...e)=>([...e],void 0),error:(...e)=>([...e],void 0)},pt=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,mt=class e extends Event{static EVENT_NAME=ht(`wxt:locationchange`);constructor(t,n){super(e.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}};function ht(e){return`${pt?.runtime?.id}:youtube:${e}`}var gt=typeof globalThis.navigation?.addEventListener==`function`;function _t(e){let t,n=!1;return{run(){n||(n=!0,t=new URL(location.href),gt?globalThis.navigation.addEventListener(`navigate`,e=>{let n=new URL(e.destination.url);n.href!==t.href&&(window.dispatchEvent(new mt(n,t)),t=n)},{signal:e.signal}):e.setInterval(()=>{let e=new URL(location.href);e.href!==t.href&&(window.dispatchEvent(new mt(e,t)),t=e)},1e3))}}}var vt=class e{static SCRIPT_STARTED_MESSAGE_TYPE=ht(`wxt:content-script-started`);id;abortController;locationWatcher=_t(this);constructor(e,t){this.contentScriptName=e,this.options=t,this.id=Math.random().toString(36).slice(2),this.abortController=new AbortController,this.stopOldScripts(),this.listenForNewerScripts()}get signal(){return this.abortController.signal}abort(e){return this.abortController.abort(e)}get isInvalid(){return pt.runtime?.id??this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(e){return this.signal.addEventListener(`abort`,e),()=>this.signal.removeEventListener(`abort`,e)}block(){return new Promise(()=>{})}setInterval(e,t){let n=setInterval(()=>{this.isValid&&e()},t);return this.onInvalidated(()=>clearInterval(n)),n}setTimeout(e,t){let n=setTimeout(()=>{this.isValid&&e()},t);return this.onInvalidated(()=>clearTimeout(n)),n}requestAnimationFrame(e){let t=requestAnimationFrame((...t)=>{this.isValid&&e(...t)});return this.onInvalidated(()=>cancelAnimationFrame(t)),t}requestIdleCallback(e,t){let n=requestIdleCallback((...t)=>{this.signal.aborted||e(...t)},t);return this.onInvalidated(()=>cancelIdleCallback(n)),n}addEventListener(e,t,n,r){t===`wxt:locationchange`&&this.isValid&&this.locationWatcher.run(),e.addEventListener?.(t.startsWith(`wxt:`)?ht(t):t,n,{...r,signal:this.signal})}notifyInvalidated(){this.abort(`Content script context invalidated`),ft.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){document.dispatchEvent(new CustomEvent(e.SCRIPT_STARTED_MESSAGE_TYPE,{detail:{contentScriptName:this.contentScriptName,messageId:this.id}})),this.options?.noScriptStartedPostMessage||window.postMessage({type:e.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:this.id},`*`)}verifyScriptStartedEvent(e){let t=e.detail?.contentScriptName===this.contentScriptName,n=e.detail?.messageId===this.id;return t&&!n}listenForNewerScripts(){let t=e=>{e instanceof CustomEvent&&this.verifyScriptStartedEvent(e)&&this.notifyInvalidated()};document.addEventListener(e.SCRIPT_STARTED_MESSAGE_TYPE,t),this.onInvalidated(()=>document.removeEventListener(e.SCRIPT_STARTED_MESSAGE_TYPE,t))}},yt={debug:(...e)=>([...e],void 0),log:(...e)=>([...e],void 0),warn:(...e)=>([...e],void 0),error:(...e)=>([...e],void 0)};return(async()=>{try{let{main:e,...t}=dt;return await e(new vt(`youtube`,t))}catch(e){throw yt.error(`The content script "youtube" crashed on startup!`,e),e}})()})();