import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength checker
  const getPasswordStrength = (pass) => {
    if (pass.length === 0) return { strength: 0, label: "", color: "" };
    if (pass.length < 6) return { strength: 33, label: "Weak", color: "error" };
    if (pass.length < 10)
      return { strength: 66, label: "Medium", color: "warning" };
    return { strength: 100, label: "Strong", color: "success" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreedToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);

    if (result.success) {
      toast.success(result.data.message);
      navigate("/dashboard");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-base-100">
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-secondary to-accent mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-base-content/60 text-sm sm:text-base">
              Join us today and boost your productivity
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error shadow-lg mb-6 animate-shake">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Register Form */}
          <div className="card bg-base-200/50 backdrop-blur-sm shadow-xl border border-base-300">
            <div className="card-body p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <User size={16} />
                      Full Name
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full pl-10 focus:input-secondary transition-all duration-300"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                  </div>
                </div>

                {/* Email Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Mail size={16} />
                      Email Address
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="input input-bordered w-full pl-10 focus:input-secondary transition-all duration-300"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                  </div>
                </div>

                {/* Password Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Lock size={16} />
                      Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="input input-bordered w-full pl-10 pr-10 focus:input-secondary transition-all duration-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 opacity-60" />
                      ) : (
                        <Eye className="w-5 h-5 opacity-60" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs opacity-60">
                          Password strength:
                        </span>
                        <span
                          className={`text-xs font-medium text-${passwordStrength.color}`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <progress
                        className={`progress progress-${passwordStrength.color} w-full h-1`}
                        value={passwordStrength.strength}
                        max="100"
                      ></progress>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Lock size={16} />
                      Confirm Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className="input input-bordered w-full pl-10 pr-10 focus:input-secondary transition-all duration-300"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 opacity-60" />
                      ) : (
                        <Eye className="w-5 h-5 opacity-60" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        Passwords don't match
                      </span>
                    </label>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <label className="label">
                      <span className="label-text-alt text-success flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        Passwords match
                      </span>
                    </label>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary checkbox-sm"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span className="label-text text-sm">
                      I agree to the{" "}
                      <a href="#" className="link link-secondary">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="link link-secondary">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-secondary w-full gap-2 group hover:shadow-lg transition-all duration-300 mt-2"
                  disabled={loading || !agreedToTerms}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* <div className="divider text-xs opacity-60">OR CONTINUE WITH</div> */}

              {/* Social Register Buttons */}
              {/* <div className="grid grid-cols-2 gap-3">
                <button className="btn btn-outline btn-sm gap-2 hover:btn-secondary transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </button>
                <button className="btn btn-outline btn-sm gap-2 hover:btn-secondary transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                    />
                  </svg>
                  GitHub
                </button>
              </div> */}

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-sm text-base-content/60">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="link link-secondary font-medium hover:link-hover"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-base-200/50">
              <Shield className="w-6 h-6 mx-auto mb-1 text-secondary" />
              <p className="text-xs font-medium">Secure</p>
            </div>
            <div className="p-3 rounded-lg bg-base-200/50">
              <Zap className="w-6 h-6 mx-auto mb-1 text-accent" />
              <p className="text-xs font-medium">Fast Setup</p>
            </div>
            <div className="p-3 rounded-lg bg-base-200/50">
              <Users className="w-6 h-6 mx-auto mb-1 text-primary" />
              <p className="text-xs font-medium">Team Ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Showcase (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-secondary via-accent to-primary p-12 items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-4xl font-bold mb-6">Start Your Journey Today</h2>
          <p className="text-lg mb-8 text-white/80">
            Join thousands of teams already using Smart Task Manager to
            streamline their workflow and achieve more together.
          </p>

          {/* Benefits List */}
          <div className="space-y-4">
            {[
              { icon: CheckCircle2, text: "Free forever for small teams" },
              { icon: Shield, text: "Enterprise-grade security" },
              { icon: Zap, text: "Lightning-fast performance" },
              { icon: Users, text: "Unlimited team members" },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5" />
                </div>
                <span className="text-white/90">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                JD
              </div>
              <div>
                <div className="font-semibold">John Doe</div>
                <div className="text-sm text-white/70">CEO, TechCorp</div>
              </div>
            </div>
            <p className="text-white/80 italic">
              "Smart Task Manager transformed how our team collaborates. We've
              seen a 40% increase in productivity since switching!"
            </p>
            <div className="flex gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 fill-yellow-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Register;
