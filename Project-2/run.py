import os
import subprocess

def main():
    print("Running command: ./mvnw spring-boot:run")
    try:
        subprocess.run("./mvnw spring-boot:run", shell=True, check=True)
    except KeyboardInterrupt:
        print("\nStopped.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
