import os
import subprocess

def main():
    print("Running command: npm run dev")
    try:
        subprocess.run("npm run dev", shell=True, check=True)
    except KeyboardInterrupt:
        print("\nStopped.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
