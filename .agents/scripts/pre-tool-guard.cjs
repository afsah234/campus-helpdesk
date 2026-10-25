/**
 * Antigravity Lifecycle Hook: PreToolUse Safety Guard
 * 
 * Inspects tool calls before execution.
 * Input: JSON on stdin (with toolCall, stepIdx, etc.)
 * Output: JSON on stdout (decision: "allow" | "deny" | "ask")
 */

function main() {
  let inputBuffer = '';

  process.stdin.setEncoding('utf8');

  process.stdin.on('data', (chunk) => {
    inputBuffer += chunk;
  });

  process.stdin.on('end', () => {
    try {
      if (!inputBuffer.trim()) {
        process.stdout.write(JSON.stringify({ decision: 'allow' }));
        return;
      }

      const payload = JSON.parse(inputBuffer);
      const toolCall = payload.toolCall || {};
      const toolName = toolCall.name || '';
      const args = toolCall.args || {};

      // Dangerous command guard for run_command
      if (toolName === 'run_command' && args.CommandLine) {
        const cmd = args.CommandLine.toLowerCase();
        const blockedPatterns = [
          'rmdir /s /q c:\\',
          'format c:',
          'git push --force',
          'git reset --hard origin/main',
        ];

        for (const pattern of blockedPatterns) {
          if (cmd.includes(pattern)) {
            const denyResponse = {
              decision: 'deny',
              reason: `[Antigravity Safety Gate] Blocked potentially destructive command containing '${pattern}'.`,
            };
            process.stdout.write(JSON.stringify(denyResponse));
            return;
          }
        }
      }

      // Default: allow safe execution
      process.stdout.write(JSON.stringify({ decision: 'allow' }));
    } catch {
      // In case of parsing error, fail safe and allow
      process.stdout.write(JSON.stringify({ decision: 'allow' }));
    }
  });
}

main();

