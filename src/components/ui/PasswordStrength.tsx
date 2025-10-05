interface PasswordStrengthProps {
  password: string;
}

type Strength = 'weak' | 'fair' | 'good' | 'strong';

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getPasswordStrength = (pwd: string): { strength: Strength; score: number } => {
    let score = 0;

    if (!pwd) return { strength: 'weak', score: 0 };

    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(pwd)) score += 1; // lowercase
    if (/[A-Z]/.test(pwd)) score += 1; // uppercase
    if (/[0-9]/.test(pwd)) score += 1; // numbers
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1; // special characters

    // Determine strength
    if (score <= 2) return { strength: 'weak', score };
    if (score <= 3) return { strength: 'fair', score };
    if (score <= 4) return { strength: 'good', score };
    return { strength: 'strong', score };
  };

  const { strength, score } = getPasswordStrength(password);

  const strengthConfig = {
    weak: { color: 'bg-red-500', text: 'Weak', textColor: 'text-red-500' },
    fair: { color: 'bg-orange-500', text: 'Fair', textColor: 'text-orange-500' },
    good: { color: 'bg-yellow-500', text: 'Good', textColor: 'text-yellow-500' },
    strong: { color: 'bg-green-500', text: 'Strong', textColor: 'text-green-500' },
  };

  const config = strengthConfig[strength];
  const percentage = (score / 6) * 100;

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${config.color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Password Strength:</span>
        <span className={`text-xs font-semibold ${config.textColor}`}>
          {config.text}
        </span>
      </div>

      {/* Requirements */}
      <div className="space-y-1 text-xs">
        <div className={password.length >= 8 ? 'text-green-500' : 'text-gray-500'}>
          {password.length >= 8 ? '✓' : '○'} At least 8 characters
        </div>
        <div className={/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-500'}>
          {/[A-Z]/.test(password) ? '✓' : '○'} Contains uppercase letter
        </div>
        <div className={/[a-z]/.test(password) ? 'text-green-500' : 'text-gray-500'}>
          {/[a-z]/.test(password) ? '✓' : '○'} Contains lowercase letter
        </div>
        <div className={/[0-9]/.test(password) ? 'text-green-500' : 'text-gray-500'}>
          {/[0-9]/.test(password) ? '✓' : '○'} Contains number
        </div>
      </div>
    </div>
  );
}
